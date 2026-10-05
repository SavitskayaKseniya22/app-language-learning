# [Lang app](https://app-language-learning.netlify.app/)

Приложение для изучения английского языка через игры

## Возможности

- Адаптивный интерфейс
- Авторизация
- Учебник
- Игра «Спринт»
- Игра «Аудиовызов»
- Игра «Пазлы»
- Игра «Конструктор»
- Личная коллекция слов
- Статистика игр

## Технологии

- React
- Vite
- Typescript
- Redux
- SCSS-модули
- Eslint
- Prettier
- React-hook-form
- React-router
- @hello-pangea/dnd
- Supabase
- React-toastify

## Запуск проекта

1. Клонируйте репозиторий

```bash
git clone https://github.com/SavitskayaKseniya22/lang-app.git
```

2. Установите зависимости

```bash
npm install
```

3. Скопируйте `.env.example` в `.env.local` и укажите URL проекта Supabase и публичный ключ. В проекте Supabase должны быть таблицы и RPC-функции, описанные в `src/shared/api/supabase/database.types.ts`.

4. Запустите сервер разработки

```bash
npm run dev
```

## База данных

В `supabase/migrations/` сохранена структура существующего проекта Supabase:
таблицы `words`, `profiles`, `game_results`, `user_word_progress`, функции сохранения
результатов, индексы, ограничения, права и RLS-политики. Отдельная миграция создаёт
триггер регистрации профиля и публичный bucket `words`.

Миграции содержат структуру и настройки, без аккаунтов, результатов пользователей,
словарных записей и файлов изображений/аудио. Они требуют окружения Supabase:
служебные схемы `auth` и `storage` создаются самой платформой.

### Локальная проверка

Запустите Docker Desktop, затем из корня проекта:

```bash
npx supabase db start
docker cp supabase/tests/schema-smoke.sql supabase_db_app-language-learning:/tmp/language-learning-smoke.sql
docker exec supabase_db_app-language-learning psql -U postgres -d postgres -v ON_ERROR_STOP=1 -f /tmp/language-learning-smoke.sql
```

Первый запуск создаёт локальную базу и применяет миграции. Проверка создаёт временные
записи, проверяет создание профиля, обе RPC-функции, доступ к учебнику и изоляцию
результатов/прогресса пользователей через RLS. В конце записи откатываются.
Локальная база доступна на порту `54322`. Для запуска всего локального Supabase,
включая авторизацию, API и Storage, используйте `npx supabase start`.

### Работа с существующим облачным проектом

Начальные миграции — снимок уже существующей структуры. Не выполняйте `db push`
для связанного облачного проекта: сначала нужно согласовать историю миграций,
чтобы CLI не пытался повторно создать существующие объекты. При подготовке этих
файлов рабочие таблицы и история миграций не изменялись.

Следующие изменения базы оформляйте отдельными миграциями и проверяйте локально.
Настройки почты, OAuth и другие настройки проекта, словарные данные и сами файлы
Storage переносятся отдельно.

### Ограничения текущей схемы

Снимок сохраняет существующее поведение. У `profiles` включён RLS, но нет политик
для чтения/изменения профиля пользователем. RPC принимают очки от клиента и не
защищают сохранение от повторного запроса с тем же результатом. Эти изменения
нужно вводить отдельными миграциями вместе с изменениями приложения.

### Скриншоты

![изображение](https://github.com/SavitskayaKseniya22/projects-photos/blob/main/photos/lang-app/screenshots/main-page.png)
![изображение](https://github.com/SavitskayaKseniya22/projects-photos/blob/main/photos/lang-app/screenshots/textbook-desktop.png)
