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
	text := fmt.Sprintf("user_email:\n%v\n\nuser_message:\n%v\n\nRemoteAddr:\n%v", r.FormValue("user_email"), r.FormValue("user_message"), r.FormValue("user_remote_addr"))
	sendTelegramMsg(text)
}

func envVariables() (apiKey string, chatID int64) {
	chatID, err := strconv.ParseInt(os.Getenv("TELEGRAMCHATID"), 10, 64)
	if err != nil {
		// There was an error getting the CHATID
		chatID = -1
	}
	return os.Getenv("TELEGRAMAPI"), chatID
}

func sendTelegramMsg(text string) {
	apiKey, chatID := envVariables()
	bot, err := tgbotapi.NewBotAPI(apiKey)
	if err != nil {
		// Can't send any telegram messages, so Panic :(
		log.Panic(err)
	}

	if chatID == -1 {
		// No chatID was supplied to lets make sure the user knows what the chatID is
		sendChatID(bot)
	} else {
		msg := tgbotapi.NewMessage(chatID, text)
		bot.Send(msg)
	}
}

func sendChatID(bot *tgbotapi.BotAPI) {
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := bot.GetUpdatesChan(u)

	for update := range updates {
		if update.Message == nil { // ignore any non-Message Updates
			continue
		}

		log.Printf("[%s] %s", update.Message.From.UserName, update.Message.Text)

		msg := tgbotapi.NewMessage(update.Message.Chat.ID, update.Message.Text)
		msg.ReplyToMessageID = update.Message.MessageID

		bot.Send(msg)
	}
}
