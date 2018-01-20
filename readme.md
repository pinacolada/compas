# COMPAS - JANVIER 2018

## Compilation Actionscript - Typescript - Javascript

* Création de l'équivalent des classes usuelles utilisées en **ActionScript**
* Création de l'équivalent de ces classes en **Typescript**
* Compilation et lancement de ces classes : 
    - dans le navigateur, sous forme de page **HTML**
    - dans une application de bureau, avec **Electron**,
    - comme un **swf** compilé avec le compilateur de **Flash Develop** (MXML)  

Les classes visuelles doivent pouvoir être reproduites à l'identique **avec les mêmes commandes**  en **Javascript** et en **Actionscript**.

Voici la procédure utilisée pour créer l'environnement de programmation dans **VSCode** 

### Création de l'espace de travail 

* Ouverture de la **console** dans VSCode. 
* Écriture des commandes suivantes : 
    -   Commande de changement d'unité : `D:`
    -   Commande de changement de dossier : `cd repos`
    -   Commande de création d'un dossier Compas : `md compas`. Le dossier est créé.
    -   Commande de changement de dossier : On va dans le dossier créé `cd compas`. Le prompt l'affiche.
    -   On rouvre VSCode dans le bon dossier en tapant la commande : `code .` dans la console (le mot **code**, suivi par un point). Cela ouvre le dossier dans **VSCode** le dossier dans lequel vient de se positionner.)

### Initialisation du contenu 

* Réouverture de la **console** dans VSCode. 
* Écriture des commandes suivantes : 
- `npm init` : le fichier **package.json** est ainsi créé : on remplit les rubriques... 
- `npm install typescript -D` 
- `npm install electron -D`
- `tsc --init` : le fichier **tsconfig.json** est ainsi créé. Target modifié : **ES2016** (Pour les nouvelles commandes sur l'Array !). Tout le reste est laissé à l'identique.

Initialisation du dépot **github** : Il faut d'abord exclure le dossier **node_modules**.
* Création (en cliquant sur le + dans l'interface de **VSCode**) d'un fichier nommé précisément **.gitignore** (avec un point initial et pas d'extension).
* Écriture dans ce fichier de la simple ligne **node_modules** : ce dossier sera ignoré et son contenu ne fera pas partie du dépot **github**. Retour dans la console et écriture des commandes : 
- `git init`
- `git add .`
- `git status`
- `git commit -m "Initialisation du dossier Compas"`

Création de ce fichier **readme.md** et ajout au dépot (Commandes `git add .` puis `git status` pour vérifier.)

Création d'un premier fichier **typescript** pour tester la compilation : on veut pouvoir le lancer avec **Electron** (qui se lance par défaut en cherchant un fichier **main.js**. 

Donc on crée un fichier **main.ts** en cliquant sur le + dans l'interface de **Visual Studio Code** :







