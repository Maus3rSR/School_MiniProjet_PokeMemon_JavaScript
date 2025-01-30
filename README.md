# Projet noté sur JavaScript - PokeMemon Game

PokeMemon Game est un jeu de mémoire où l'objectif est de trouver les pokemons par paire pour les capturer.

## Capacités du jeu

- Le jeu de mémo a une capacité de 3 lignes et 4 colonnes.
- Il y a donc 6 paires de pokemons à trouver.

## Fonctionnalités à développer

### Boucle principale du jeu

- Le joueur clique sur un buisson.
- Le buisson se cache et affiche un pokemon.
- Le joueur choisi un deuxième buisson.
- Un deuxieme pokemon est affiché.
  - Si les deux pokemons sont identiques :
    - On affiche une pokeball pour indiquer la capture.
    - Le pokemon est affiché dans la liste des pokemons capturés sur la gauche.
  - Si les deux pokemons sont différents :
    - Après quelques secondes, on cache les pokemons et on re-affiche les buissons.
    - Tant que les pokemons ne sont pas cachées, le joueur ne peut pas cliquer sur d'autres buissons.

### Dispositions aléatoires des pokemons

Quelque soit la façon dont vous allez gérer cette partie, on doit pouvoir constater que les pokemons ne sont pas toujours au même endroit quand on commence une partie en rechargeant la page ou en cliquant sur le bouton rejouer.

### Rejouer

Quand le joueur a capturé tous les pokemons, il peut rejouer une nouvelle partie s'il le souhaite. Rejouer va :

- Réinitialiser le nombre de coups pour finir la partie (pas le record).
- Remettre tous les buissons visibles.
- Enlever tous les pokemons.
- Relancer votre système de disposition aléatoire des pokemons.

### Statistiques

- Quand le joueur affiche une paire de pokemons, que cela soit juste ou non, on comptabilise 1 coup.
- Entre différentes parties, on retient le record du nombre de coups minimum pour finir le jeu. (Au minimum nous pouvons finir le jeu en 6 coups).
- Ces deux statistiques sont affichées à l'endroit prévu dans le code HTML.

### Animation

Vous avez vous quelques animations sur les buissons. Ajoutez des animations lorsque :

- Un pokemon s'affiche
- Une pokeball s'affiche
- Un pokemon est ajouté à la liste des pokemons capturés

Ce qui a été utilisé est la librairie [`animate.css`](https://animate.style/).
Vous n'êtes autorisés à ajouter les animations qu'[avec l'aide de JavaScript](https://animate.style/#javascript). Ce n'est que l'ajout de classes. Lisez bien la documentation sur son fonctionnement.

### Persistance des données du jeu

En utilisant l'api [`localStorage`](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage), faites en sorte de que si on recharge la page, on puisse :

- Retrouver notre record
- Reprendre notre partie en cours

### Fonctionnalité avancée : Grille dynamique de jeu en fonction du nombre de pokemons

Nous allons permettre au joueur lorsqu'il souhaite rejouer de permet de choisir le nombre de pokemons dans le jeu.

Un peu de préparation dans le projet :

- Décommentez de la ligne 46 à 58 du fichier HTML le formulaire
- Dans le fichier JavaScript, changez le fichier des données des pokemons pour utiliser le format 4x6.
- Videz **complètement** l'intérieur de la grille de jeu `#grille_de_jeu` de son HTML.

Vous observerez dans le formulaire un slider, c'est ce qui déterminera le nombre de pokemons dans la grille de jeu.

**Le nombre de pokemons est forcément paire, minimum 4 et maximum 12. Le maximum dépend du nombre de pokemons dans la data que vous récupérez.**

- Vous devez [configurer les propriétés de votre slider](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input/range) avec le bon min, max et step avec JavaScript.
- Vous devez vérifier à la soumission du formulaire que le nombre du slider soit correct. N'oubliez pas `event.preventDefault();` pour que la page ne se recharge pas lors de la soumission du formulaire.
- Votre grille doit se générer dynamiquement avec JavaScript. **Vous êtes exceptionnellement autorisés à utiliser les [`<template` HTML](https://developer.mozilla.org/fr/docs/Web/HTML/Element/template).** Je ne veux pas voir une grille avec 4x6 buissons dans le html ! Posez vous la question : _"Si un jour j'ai une API qui me permet de récupérer tous les pokemons existants, comment rendre cette grille dynamique entre 4 et X pokemons ?"_

## Consignes

- Réfléchissez à la structure de vos données
  - Comment allez vous stocker vos statistiques
  - Comment allez vous faire le lien entre un pokemon et ses deux positions dans la grille de jeu
  - Comment allez vous gérer la disposition aléatoire
  - Allez-y étape par étape. N'hésitez pas à réecrire votre code si besoin. Jeter du code n'est pas une mauvaise chose !
- Vous n'êtes pas obligé de faire les fonctionnalités dans l'ordre. A vous de vous organiser et de ne pas essayer de tout faire en même temps.
- J'autorise exceptionnellement la modification du fichier HTML si vous en avez vraiment besoin. Cependant le projet peut se faire uniquement avec du JavaScript. Des points bonus sont accordés lors que l'on ne modifie pas le fichier HTML et CSS.
- N'hésitez pas à faire du pair programming, c'est à dire :
  - Travailler ensemble sur un même PC.
  - Ou avec LiveShare de VSCode.
  - Vous pouvez bien sûr travailler chacun de votre côté, cependant vous êtes plus efficace à deux sur un problème à résoudre que tout seul, très souvent :) Cela dépendra bien sûr de vos affinités à travailler ensemble et à communiquer efficacement
- Faites des commits réguliers ! Plus vos commits sont petits avec une description compréhensible, plus il est facile de comprendre ce que vous avez fait, et surtout cela vous force à découper vos tâche en plus petites tâches ! Des points bonus sont accordés lorsque vous faites des commits reguliers et compréhensibles.
- Le rendu du projet noté se fait sur le devoir TEAMS. Vous mettez UNIQUEMENT votre lien github.

## Grille de notation

Note sur 100 points ramené à 20.

### Boucle principale du jeu (40 points)

### Dispositions aléatoires des pokemons (10 points)

### Rejouer (5 points)

### Statistiques (2 points)

### Animation (2 points)

### Persistance des données du jeu (2 points)

### Fonctionnalité avancée : Grille dynamique de jeu en fonction du nombre de pokemons (24 points)

### Commits réguliers et compréhensibles sur Git (5 points)

### Propreté du code (nommage, indentation, lisibilité etc.) (5 points)

### Qualité d'architecture (séparation des responsabilités entre le code logique, et le code qui manipule le DOM, encapsulation, etc.) (5 points)

### Bonus pour efforts exceptionnels, innovation, réalisation de fonctionnalités supplémentaires, etc. (selon l'humeur du prof)

---

**Note :** Des points malus peuvent être données à plusieurs équipes si votre code se ressemble très sensiblement ! Soyez originaux et travaillez dans votre groupe. Je n'interdit pas les échanges, mais évitez de copier/coller du code d'autres équipes.
Cela compte également pour l'Intelligence Artificielle si elle vous fournit du code très similaire d'une équipe à l'autre ;-)
