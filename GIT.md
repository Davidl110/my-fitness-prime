# Chuleta de Git

## El ciclo de todos los dias
Cada vez que cambio algo y lo quiero guardar:

git status
git add .
git commit -m "que hice y por que"
git push

## Cuando no se que pasa
git status              -> que cambio
git log --oneline       -> historial de versiones

## Solo la primera vez de un proyecto nuevo
git init
git add .
git commit -m "Version inicial"
git branch -M main
git remote add origin https://github.com/Davidl110/NOMBRE.git
git push -u origin main

## Que significa cada uno
git status   -> que cambio desde la ultima foto
git add .    -> meto todo en el sobre
git commit   -> saco la foto con una nota
git push     -> subo las fotos a GitHub
git log      -> hojeo el album
