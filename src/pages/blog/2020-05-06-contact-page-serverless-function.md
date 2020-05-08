---
templateKey: blog-post
title: Contact Page Serverless Function
date: 2020-05-06T16:33:09.423Z
description: The serverless function behind the contact page form submission.
featuredpost: true
featuredimage: /img/go.png
tags:
  - go
  - serverless
  - jamstack
  - netlify
  - now
---
![go](/img/go.png)

## Purpose

The purpose of this small golang program api endpoint is to allow people to contact me without providing an email address to the world. There are a ton of ways to implement a way of contacting someone over the internet that doesn't involve an email address, one of the most common ways would be to include some social media button(s), but alas I'm not a huge social media fan. Ultimately, I decided it would be exciting to bake up my own solution to the problem. It would give me an opportunity to practice some serverless functions and show a little bit about JAMSTACK.

## Setup

A little background information is needed to better understand what this program is doing. I am using <Link className="text-blue-700" to="https://vercel.com/docs/v2/serverless-functions/supported-languages#go">Vercel.com</Link> to host / run my serverless functions. The specs basically specify that a function must be exported with the name Handler that accepts two params - http.ResponseWriter and *http.Request.

```go
package packageName

import (
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
}
```

In simple terms the request *r* will come in, the program can do its thing and write any data back to the ResponseWriter *w*.

## Getting Telegram Setup

I'm not going to spend too much time here because Telegram isn't really the focus of this program, but want to make sure this program can be replicated by others, or more likely by my forgetful self in the future.. 

>Future me, this is how you did it back in the day. Hope you are doing well. - Past me

Anyways, without further dialog between past me and future me, here is the high level overview.

1. Get a telegram bot api token from https://t.me/botfather
1. Setup "Go Telegram Bot API" github.com/go-telegram-bot-api/telegram-bot-api
  1. Get chatID - The chatID is where the telegram message will be sent to.
1. Setup Environment variables **TELEGRAMCHATID** and **TELEGRAMAPI**. View vercel.com documentation to set variables.

## Getting Env Variables

Getting env variables is essential to most programs. Go's os package makes it easy to gram env variable.

```go
func envVariables() (apiKey string, chatID int64) {
	chatID, err := strconv.ParseInt(os.Getenv("TELEGRAMCHATID"), 10, 64)
	if err != nil {
		log.Panic(err)
	}
	return os.Getenv("TELEGRAMAPI"), chatID
}
```

Above is my implementation of a function to get the variables needed to send Telegram messages.

## Composing a Message to Send

So, there are two ways to get data to our API Endpoint. URL encoded query strings and form data, conveniently the "net/http" package in go provides the `FormValue()` function that will use either.

```go
func Handler(w http.ResponseWriter, r *http.Request) {
	text := fmt.Sprintf("user_email:\n%v\n\nuser_message:\n%v\n\nRemoteAddr:\n%v",
	r.FormValue("user_email"),
	r.FormValue("user_message"),
	r.FormValue("user_remote_addr"))
	sendTelegramMsg(text)
}
```

I'm composing the full message text using fmt.Sprintf, which prints the resulting string to the text variable. Again, go makes it super easy to compose strings together with `%v` verb. `%v` will output the string value of a variable provided after the string in the comma separated list of arguments.

## Sending the Telegram Message

This part is made easy thanks to the "Go Telegram Bot API" found here: github.com/go-telegram-bot-api/telegram-bot-api. Simply setup a new bot using the telegram apiKey `bot, err := tgbotapi.NewBotAPI(apiKey)`, then send a message to the desired chat by composing the message `msg := tgbotapi.NewMessage(chatID, text)` and sending it off with `bot.Send(msg)`.

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

Here is the full source code put together.

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

I would really love to hear from you. Seriously, feel free to send me a message about anything.
