#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EMTP Analyzer - Анализатор проектов EasyBuilder Pro
Автоматически извлекает метаданные из .emtp файлов и проверяет безопасность.

Автор: Lead Architect (AI Assistant)
Дата: 2026-09-07
"""

import zipfile
import os
import sys
import re
import json
import tempfile
import shutil
from pathlib import Path
from datetime import datetime
from xml.etree import ElementTree as ET


# ========================================
# КОНФИГУРАЦИЯ
# ========================================

# Регулярные выражения для поиска "опасных" данных
IP_PATTERN = re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')
PASSWORD_PATTERNS = [
    re.compile(r'password\s*=\s*["\']?([^"\'\s>]+)', re.IGNORECASE),
    re.compile(r'pwd\s*=\s*["\']?([^"\'\s>]+)', re.IGNORECASE),
    re.compile(r'<Password[^>]*>([^<]+)</Password>', re.IGNORECASE),
]

# IP-адреса, которые можно игнорировать (локальные/дефолтные)
SAFE_IPS = {'127.0.0.1', '0.0.0.0', '255.255.255.255'}

# Файлы, которые нужно анализировать в первую очередь
PRIORITY_FILES = ['Project.xml', 'System.xml', 'Device.xml', 'Communication.xml']


# ========================================
# ФУНКЦИИ АНАЛИЗА
# ========================================

def extract_emtp(emtp_path: str, extract_dir: str) -> bool:
    """Распаковывает .emtp файл (ZIP-архив) в указанную папку."""
    try:
        with zipfile.ZipFile(emtp_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        return True
    except zipfile.BadZipFile:
        print(f"❌ Ошибка: файл не является ZIP-архивом: {emtp_path}")
        return False
    except Exception as e:
        print(f"❌ Ошибка при распаковке: {e}")
        return False


def count_screens(extract_dir: str) -> tuple:
    """Считает количество экранов в проекте."""
    screens = []
    window_dir = Path(extract_dir) / 'Window'
    
    if window_dir.exists():
        for file in window_dir.rglob('*'):
            if file.suffix.lower() in ['.exob', '.cob', '.xml']:
                screens.append(file.name)
    
    return len(screens), screens


def count_macros(extract_dir: str) -> tuple:
    """Считает количество макросов в проекте."""
    macros = []
    macro_dir = Path(extract_dir) / 'Macro'
    
    if macro_dir.exists():
        for file in macro_dir.rglob('*'):
            if file.is_file() and file.suffix.lower() in ['.mcr', '.xml', '.txt']:
                macros.append(file.name)
    
    return len(macros), macros


def find_ip_addresses(extract_dir: str) -> list:
    """Ищет IP-адреса во всех текстовых файлах проекта."""
    found_ips = set()
    
    for file_path in Path(extract_dir).rglob('*'):
        if not file_path.is_file():
            continue
        
        # Пропускаем бинарные файлы
        if file_path.suffix.lower() in ['.exob', '.cob', '.bin', '.dll', '.png', '.jpg', '.webp']:
            continue
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                ips = IP_PATTERN.findall(content)
                for ip in ips:
                    # Проверяем валидность IP
                    parts = ip.split('.')
                    if all(0 <= int(p) <= 255 for p in parts):
                        if ip not in SAFE_IPS:
                            found_ips.add((ip, str(file_path.relative_to(extract_dir))))
        except Exception:
            continue
    
    return list(found_ips)


def find_passwords(extract_dir: str) -> list:
    """Ищет пароли и чувствительные данные в XML-файлах."""
    found_passwords = []
    
    for file_path in Path(extract_dir).rglob('*.xml'):
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                for pattern in PASSWORD_PATTERNS:
                    matches = pattern.findall(content)
                    for match in matches:
                        if match and len(match) > 0:
                            found_passwords.append((match, str(file_path.relative_to(extract_dir))))
        except Exception:
            continue
    
    return found_passwords


def get_project_info(extract_dir: str) -> dict:
    """Извлекает основную информацию о проекте из XML."""
    info = {
        'ebpro_version': 'unknown',
        'target_hmi': [],
        'project_name': 'unknown',
    }
    
    # Ищем Project.xml
    for xml_name in PRIORITY_FILES:
        xml_files = list(Path(extract_dir).rglob(xml_name))
        if xml_files:
            try:
                tree = ET.parse(xml_files[0])
                root = tree.getroot()
                
                # Ищем версию
                for elem in root.iter():
                    if 'version' in elem.tag.lower() or 'Version' in elem.tag:
                        if elem.text and elem.text.strip():
                            info['ebpro_version'] = elem.text.strip()
                    
                    # Ищем модель панели
                    if 'model' in elem.tag.lower() or 'Model' in elem.tag:
                        if elem.text and elem.text.strip():
                            if elem.text.strip() not in info['target_hmi']:
                                info['target_hmi'].append(elem.text.strip())
                    
                    # Ищем имя проекта
                    if 'name' in elem.tag.lower() and not info['project_name'] == 'unknown':
                        if elem.text and elem.text.strip():
                            info['project_name'] = elem.text.strip()
                            
            except ET.ParseError:
                continue
            except Exception:
                continue
    
    return info


def analyze_folder_structure(extract_dir: str) -> dict:
    """Анализирует структуру папок проекта."""
    structure = {
        'total_files': 0,
        'total_size': 0,
        'folders': [],
    }
    
    for file_path in Path(extract_dir).rglob('*'):
        if file_path.is_file():
            structure['total_files'] += 1
            structure['total_size'] += file_path.stat().st_size
    
    for folder in Path(extract_dir).iterdir():
        if folder.is_dir():
            structure['folders'].append(folder.name)
    
    return structure


# ========================================
# ГЕНЕРАЦИЯ ОТЧЕТА
# ========================================

def generate_report(emtp_path: str, extract_dir: str) -> dict:
    """Генерирует полный отчет о проекте."""
    print("\n" + "=" * 70)
    print(f"🔍 АНАЛИЗ ПРОЕКТА: {Path(emtp_path).name}")
    print("=" * 70 + "\n")
    
    # Основная информация
    print("📋 ОСНОВНАЯ ИНФОРМАЦИЯ:")
    project_info = get_project_info(extract_dir)
    print(f"   • Версия EasyBuilder Pro: {project_info['ebpro_version']}")
    print(f"   • Целевые панели: {', '.join(project_info['target_hmi']) if project_info['target_hmi'] else 'не определены'}")
    print()
    
    # Структура
    print("📁 СТРУКТУРА ПРОЕКТА:")
    structure = analyze_folder_structure(extract_dir)
    print(f"   • Всего файлов: {structure['total_files']}")
    print(f"   • Общий размер: {structure['total_size'] / 1024:.1f} KB")
    print(f"   • Папки: {', '.join(structure['folders'])}")
    print()
    
    # Экраны и макросы
    print("🖼 ЭКРАНЫ И МАКРОСЫ:")
    screens_count, screens = count_screens(extract_dir)
    macros_count, macros = count_macros(extract_dir)
    print(f"   • Экранов: {screens_count}")
    if screens and len(screens) <= 10:
        for s in screens[:10]:
            print(f"      - {s}")
    elif screens:
        for s in screens[:5]:
            print(f"      - {s}")
        print(f"      ... и еще {len(screens) - 5}")
    
    print(f"   • Макросов: {macros_count}")
    if macros and len(macros) <= 10:
        for m in macros[:10]:
            print(f"      - {m}")
    print()
    
    # Проверка безопасности
    print("🔒 ПРОВЕРКА БЕЗОПАСНОСТИ:")
    
    # IP-адреса
    found_ips = find_ip_addresses(extract_dir)
    if found_ips:
        print(f"   ⚠️  НАЙДЕНО IP-АДРЕСОВ: {len(found_ips)}")
        for ip, file in found_ips[:10]:
            print(f"      • {ip} → {file}")
        if len(found_ips) > 10:
            print(f"      ... и еще {len(found_ips) - 10}")
    else:
        print("   ✅ IP-адреса не найдены")
    
    # Пароли
    found_passwords = find_passwords(extract_dir)
    if found_passwords:
        print(f"   ⚠️  НАЙДЕНО ПАРОЛЕЙ/ЧУВСТВИТЕЛЬНЫХ ДАННЫХ: {len(found_passwords)}")
        for pwd, file in found_passwords[:5]:
            masked = pwd[:2] + '*' * (len(pwd) - 2) if len(pwd) > 2 else '***'
            print(f"      • {masked} → {file}")
    else:
        print("   ✅ Пароли не найдены")
    
    print()
    
    # Формируем словарь для metadata.json
    metadata = {
        "id": Path(emtp_path).stem.lower().replace(' ', '-'),
        "title": project_info['project_name'],
        "description": "Описание проекта (заполнить вручную)",
        "ebpro_version": project_info['ebpro_version'],
        "target_hmi": project_info['target_hmi'],
        "complexity": "medium",
        "category": "SCADA",
        "tags": [],
        "features": {
            "screens_count": screens_count,
            "macros_count": macros_count,
            "has_recipe": False,
            "has_data_logging": False,
            "has_alarm_server": False,
            "has_trends": False,
        },
        "plc_connection": {
            "controller": "уточнить",
            "protocol": "уточнить",
            "public_version": "симуляция на LW-тегах"
        },
        "author": "Иван Ежов",
        "date_added": datetime.now().strftime("%Y-%m-%d"),
        "is_public_version_ready": len(found_ips) == 0 and len(found_passwords) == 0,
        "security_warnings": {
            "ip_addresses_found": len(found_ips),
            "passwords_found": len(found_passwords),
        }
    }
    
    return metadata


def save_metadata(metadata: dict, output_path: str):
    """Сохраняет метаданные в JSON-файл."""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    print(f"💾 Метаданные сохранены в: {output_path}")


# ========================================
# ГЛАВНАЯ ФУНКЦИЯ
# ========================================

def main():
    if len(sys.argv) < 2:
        print("Использование: python emtp_analyzer.py <путь_к_emtp_файлу> [путь_для_сохранения_metadata]")
        print()
        print("Пример:")
        print("  python emtp_analyzer.py main_project.emtp")
        print("  python emtp_analyzer.py main_project.emtp metadata.json")
        sys.exit(1)
    
    emtp_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else 'metadata_analyzed.json'
    
    if not os.path.exists(emtp_path):
        print(f"❌ Файл не найден: {emtp_path}")
        sys.exit(1)
    
    # Создаем временную папку для распаковки
    temp_dir = tempfile.mkdtemp(prefix='emtp_analyzer_')
    
    try:
        # Распаковываем
        if not extract_emtp(emtp_path, temp_dir):
            sys.exit(1)
        
        # Анализируем
        metadata = generate_report(emtp_path, temp_dir)
        
        # Сохраняем метаданные
        save_metadata(metadata, output_path)
        
        print("\n" + "=" * 70)
        if metadata['is_public_version_ready']:
            print("✅ ПРОЕКТ ГОТОВ К ПУБЛИКАЦИИ (безопасная версия)")
        else:
            print("⚠️  ТРЕБУЕТСЯ ОБЕЗЛИЧИВАНИЕ ПЕРЕД ПУБЛИКАЦИЕЙ")
        print("=" * 70 + "\n")
        
    finally:
        # Удаляем временную папку
        shutil.rmtree(temp_dir, ignore_errors=True)


if __name__ == '__main__':
    main()