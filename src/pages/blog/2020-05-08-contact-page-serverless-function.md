---
templateKey: blog-post
title: Email-less Contact Page
date: 2020-05-08T04:12:38.145Z
description: An innovative, creative, and fun way to implement a contact page without the usual email or social media options.
featuredpost: true
featuredimage: /img/go.png
tags:
  - go
  - serverless
  - jamstack
  - netlify
  - now
---

The purpose of this golang serverless function is to allow people to contact me without providing my email address. There are countless ways of contacting someone over the internet that doesn't involve an email address. One of the more common ways would be to include social media button(s), but alas, I'm not a huge social media fan. Ultimately, I decided it would be exciting to bake up my own solution to the problem, as it would give me an opportunity to practice JAMSTACK development utilizing serverless functions in golang.

## Setup

A little background information is needed to better understand what this program will be doing. It will be utilizing <Link className="text-blue-700" to="https://vercel.com/docs/v2/serverless-functions/supported-languages#go">Vercel.com</Link> to host / run the serverless functions. Vercel's specs specify that a function must be exported with the name `Handler` that accepts two parameters - `http.ResponseWriter` and `*http.Request` - to run as a serverless function on their platform.

```go
package packageName

import (
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
}
```

In simple terms, the request `r` will come in, then the program can preform its logic and write any data back using the ResponseWriter `w`.

## Getting Telegram Setup

I'm not going to spend too much time here because Telegram isn't really the focus of this post, but I want to make sure this process can be replicated by others... or more likely by my forgetful future-self.

>Future-Garrett,
>
>This is how you did it back in the day. Hope you are doing well.
>
>From,
>
>Past-Garrett

Anyways, without further dialog between past-me and future-me, here is the high level overview.

1. Get a telegram bot api token from:  https://t.me/botfather
1. Setup "Go Telegram Bot API" and get your chat ID using the examples provided at: https://github.com/go-telegram-bot-api/telegram-bot-api
1. Set the following production environment variables - **TELEGRAMCHATID** and **TELEGRAMAPI** - in Vercel's dashboard. Use the instructions provided here: https://vercel.com/docs/v2/build-step#environment-variables

## Getting Environment Variables

Getting environment variables is essential to most programs. Golang's `os` package makes it easy to access environment variable.

```go
func envVariables() (apiKey string, chatID int64) {
	chatID, err := strconv.ParseInt(os.Getenv("TELEGRAMCHATID"), 10, 64)
	if err != nil {
		log.Panic(err)
	}
	return os.Getenv("TELEGRAMAPI"), chatID
}
```

Above is my implementation of a function to get the environment variables needed to send Telegram messages. If for some reason the program can not parse the environment variables, `log.Panic(err)` is called because the program will be unable to send messages without it. Thus, it is a panic worthy error.

## Composing a Message to Send

There are two ways to get data to the API Endpoint - URL encoded query strings and form data. Conveniently, the `net/http` package in go provides the `FormValue()` function that will get either type of data input.

> URL encoded queries look like `https://some.url/api/endpoint?color=blue` where the variable `color` is set to `blue`

> Form / post data is included in the body of the request. Here is an example using curl: `curl -d '{"color":"blue"}' -H "Content-Type: application/json" -X POST https://some.url/api/endpoint`

```go
func Handler(w http.ResponseWriter, r *http.Request) {
	text := fmt.Sprintf("user_email:\n%v\n\nuser_message:\n%v\n\nRemoteAddr:\n%v",
	r.FormValue("user_email"),
	r.FormValue("user_message"),
	r.FormValue("user_remote_addr"))
	sendTelegramMsg(text)
}
```

The full message text can be composed using `fmt.Sprintf()`, which returns the resulting string. Go makes it convenient to compose strings together with the `%v` verb. `%v` will output the string value of a variable provided after the string in the comma separated list of arguments.

## Sending the Telegram Message

This part is made easy thanks to the "Go Telegram Bot API" found here: https://github.com/go-telegram-bot-api/telegram-bot-api. Simply setup a new bot using the telegram API key `bot, err := tgbotapi.NewBotAPI(apiKey)`, then send a message to the desired chat by composing the message `msg := tgbotapi.NewMessage(chatID, text)` and sending it off with `bot.Send(msg)`.

```go
func sendTelegramMsg(text string) {
	apiKey, chatID := envVariables()
	bot, err := tgbotapi.NewBotAPI(apiKey)
	if err != nil {
		log.Panic(err)
	}

	msg := tgbotapi.NewMessage(chatID, text)

	bot.Send(msg)
}
```

Short and sweeeeeet.

## Putting it All Together

Below is the full source code.

```go{numberLines: true}
package handle

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	text := fmt.Sprintf("user_email:\n%v\n\nuser_message:\n%v\n\nRemoteAddr:\n%v",
	r.FormValue("user_email"),
	r.FormValue("user_message"),
	r.FormValue("user_remote_addr"))
	sendTelegramMsg(text)
}

func envVariables() (apiKey string, chatID int64) {
	chatID, err := strconv.ParseInt(os.Getenv("TELEGRAMCHATID"), 10, 64)
	if err != nil {
		log.Panic(err)
	}
	return os.Getenv("TELEGRAMAPI"), chatID
}

func sendTelegramMsg(text string) {
	apiKey, chatID := envVariables()
	bot, err := tgbotapi.NewBotAPI(apiKey)
	if err != nil {
		log.Panic(err)
	}

	msg := tgbotapi.NewMessage(chatID, text)

	bot.Send(msg)
}

```

Feel free to contact me and test out this little serverless golang Telegram bot program by vising the <Link className="text-blue-700" to="/contact">Contact Page.</Link>