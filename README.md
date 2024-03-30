# Syntax

There are a few syntax and rules for a dairy file.

## Topic
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
- [] write some code
- [] do some exercise
- [] enjoy my snacks
```

## Example
```
## Hobby
I started a new app called [#Dairy]() with my friend [@Homie]().
I wish to start storing my knowledge in my home server.
And here are some of the things that I need to do:
- [] Adding a lexer
- [] create commands

## Work
something else ....
```

# Command
* `dairy-cli compile <filename>`: for syntax check, storing topics and syntax.
* `daily-cli show --topic=<topic> --tags=<tag[]> --from=<from> --to=<to>`: to show file and content related to the arguments
* `daily-cli list topic --tags=<tag[]> --from=<from> --to=<to>`: list topics
* `daily-cli list tags --topic=<topic> --from=<from> --to=<to>`: list tags
* `daily-cli todos --topic=<topic> --tags=<tag[]> --from=<from> --to=<to>`: show todos

