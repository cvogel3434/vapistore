#! /bin/bash
ls
git init
git remote add origin git@github.com:cvogel3434/vapistore.git
git pull origin main
git reset --hard origin/main
git pull origin main
