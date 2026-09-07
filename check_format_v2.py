import os
import sys

# Используем абсолютный путь, чтобы избежать ошибок с C:\Windows\system32
file_path = os.path.abspath("01-smart-warehouse-AleksandroskoeBOK/source/main_project.emtp")

print(f"Проверяем файл: {file_path}\n")

if not os.path.exists(file_path):
    print("❌ Файл не найден!")
    sys.exit(1)

size = os.path.getsize(file_path)
print(f"📊 Размер файла: {size} байт ({size / 1024 / 1024:.2f} MB)")

if os.path.isdir(file_path):
    print("📁 Это ПАКА (директория)")
else:
    print("📄 Это ФАЙЛ")
    
    with open(file_path, 'rb') as f:
        # Читаем первые 50 байт для определения формата
        header = f.read(50)
        hex_str = ' '.join(f'{b:02X}' for b in header[:16])
        print(f"\n🔍 Первые 16 байт (hex): {hex_str}")
        
        # Проверяем магические числа (magic numbers)
        if header[:2] == b'PK':
            print("✅ Формат: ZIP-архив (стандартный формат экспорта EBPro)")
            print("   (Если предыдущий скрипт ошибся, возможно, файл немного поврежден или имеет нестандартное расширение)")
        elif header[:15] == b'SQLite format 3':
            print("✅ Формат: База данных SQLite")
        elif header[:5] == b'<?xml':
            print("✅ Формат: XML-файл")
        else:
            print("⚠️  Формат: Проприетарный бинарный формат Weintek")
            print("   (Внутренняя структура закрыта, прямой парсинг невозможен)")
            
        # Пробуем найти читаемый текст в первых 1000 байтах
        f.seek(0)
        try:
            text = f.read(1000).decode('utf-8', errors='ignore')
            # Ищем признаки XML или текста
            if '<' in text or 'xml' in text.lower() or 'weintek' in text.lower():
                print("\n📝 Найдены текстовые фрагменты:")
                print(text[:300].replace('\n', ' '))
        except Exception as e:
            pass

print("\n" + "="*60)
print("Вывод: Если это проприетарный формат, мы не сможем")
print("автоматически вытащить из него экраны и макросы через Python.")
print("Но у нас уже есть отличный metadata.json, заполненный вручную!")
print("="*60)