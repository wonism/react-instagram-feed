# React Instagram Feed
> Component for Instagram feeds

## Getting Started
```sh
# Installation with package manager
$ npm i -S react react-dom react-instagram-feed
```

## Development
```sh
$ npm run demo
```
- access [localhost:7777](http://localhost:7777)

## Production Bundle
```sh
$ npm run bundle
```

## Properties
| Parameter   | Type     | Remarks                                                      |
|:------------|:---------|:-------------------------------------------------------------|
| className   | string   |                                                              |
| accessToken | string   | required                                                     |
| count       | number   |                                                              |
| type        | string   | one of `popular`, `tags`, `location`, `user`                 |
| param       | string   |                                                              |
| resolution  | string   | one of `standard`, `low`, `thumbnail`                        |
| wrapper     | function | it has to return react component                             |
| hasLink     | boolean  |                                                              |
| linkTarget  | string   | one of `_blank`, `_self`                                     |
| showButton  | boolean  |                                                              |
| buttonText  | string   |                                                              |
| before      | function |                                                              |
| after       | function |                                                              |
| forceNext   | any      | if want to get next feeds, just change this property's value |

Every properties (**except accessToken**) are optional
