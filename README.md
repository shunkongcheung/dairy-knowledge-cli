# Syntax

There are a few syntax and rules for a dairy file.

## Rules
Use a H1 Heading to start a topic. All paragrah should be inside a topic.
```markdown
# Topic1
<Here is the content>
```

Use an empty link to create a tag. Different type of starter indicate various tag
1. `&` for location: `[&Home]()`
2. `@` for a contact: `[@Wife]()`
3. `#` for a general tag：`[#Icee cream]()`

Use regular todo to create a todo list.
```markdown
- [ ] write some code
- [ ] do some exercise
- [ ] enjoy my snacks
```
Use an unordered list to indicate spending
```markdown
- $<amount>: item name
```

## Example
```
# Hobby
I started a new app called [#Dairy]() with my friend [@Homie]().
I wish to start storing my knowledge in my home server.
And here are some of the things that I need to do:
- [x] Adding a [#lexer]()
- [ ] create commands

And here are the spending that i made
- $40: To buy a [#server]()
- $3: A drink to convince [@Homie]() to join me

# Work
something else ....
```

# Command
* `daily-cli show <filepath>`: to list dairy under filepath
* `daily-cli tags <filepath> <command: list/combine>`: tag manuplation
* `dailry-list spending <filepath> <csv-filepath>`: output spending into a csv
* 
## Common options
* `-a --tags=<tags[]>`: string array, filter by tags
* `-e -endDate=<endDate>`: string, yyyy-mm-dd
* `-f --fromDate=<fromDate>`: string, yyyy-mm-dd
* `-o --topics=<topic[]>`: string array, filter by topics
* `-r --isRaw`: Removing styling. text are styled by default. (e.g. cross out, link, etc)
* `-s --isSpendingListOnly`: If set, show sections with spending only

## options (show only)
* `-t --isTodoListOnly`: If set, show sections with todo's only

## options (tag list only)
* `-B --sortBy <text/count>`: Sort by text order or sort by count
* `-d --orderBy <text/count>`: Sort by text order or sort by count

## argument (tag combine only)
* `<...combine_tags> <combine_into_tags>`: A list of text as argument. The last one in the list would be the combine tag
