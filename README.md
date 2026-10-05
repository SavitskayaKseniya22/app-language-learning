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

### Скриншоты

![изображение](https://github.com/SavitskayaKseniya22/projects-photos/blob/main/photos/lang-app/screenshots/main-page.png)
![изображение](https://github.com/SavitskayaKseniya22/projects-photos/blob/main/photos/lang-app/screenshots/textbook-desktop.png)
