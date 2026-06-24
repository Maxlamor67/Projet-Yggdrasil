# Changements : Feature DAtaTAbles

C'est dans la page /test pour éviter de casser des choses dans la vrai page /map

- Il y a 4 Mode de DataTAble (1 pour chaques type d'objet qu'on affiche)
- Zone_Table n'est pas implémenté pcq c pas demandé et on va pas se faire chier sur ça pour le moment
- Les fonctionnalités spécifiques à `<Pointlist>` vont devoir être migrés dans les fichiers liés à `<PointTable>`

### Comment sont fait les DAtaTAbles :

Dans `components` il y a un dossier pour chaque type (ex. equipment_table)

4 fichiers par tables:

- type.ts (mockdata + type de donné)
- Table (table)
- TableRow (comment sont les lignes de la Table)
- ExpandedContent (contenu du Collapsible lorsqu'on l'étend)
- EditSheet (le Sheet qui apparait lorsqu'on clique sur "modifier" sur un elmt)

---

Dans la page où on affiche les table, on utilise donc le `<Tabs>` Shadcn

---
### Encore à faire 

- Modifier les fonctions pour qu'elles soient les vraies liées à l'API (fetch, delete, Edit) 
- implémenter les fonctions "Voir sur la carte" des elements
- Lier les equipes aux equipements
