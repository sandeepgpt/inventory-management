client=> .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

server=> .env
PORT=8000
DATABASE_URL = "postgresql://postgres:root@localhost:5432/inventory?schema=public"

git remote add origin https://github.com/sandeepgpt/storageprojectbuild.git
git branch -M main
git push -u origin main
