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
2. `@` for a contact:‵[@Wife]()‵
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
* `daily-cli show --topics=<topic[]> --tags=<tag[]> --from=<from> --to=<to> --spending --todos --paragraph`: to show file and content related to the arguments
* `daily-cli list <topics/tags> --topics=<topic[]> --tags=<tag[]> --from=<from> --to=<to>`: to show file and content related to the arguments
