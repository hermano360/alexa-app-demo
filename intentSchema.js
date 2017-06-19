{
  "intents": [
    {
      "intent": "AMAZON.YesIntent"
    },
    {
      "intent": "AMAZON.NoIntent"
    },
    {
      "intent": "AMAZON.HelpIntent"
    },
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    },
    {
      "intent": "AMAZON.StartOverIntent"
    },
    {
      "slots": [
        {
          "name": "Language",
          "type": "languageType"
        }
      ],
      "intent": "LanguageIntent"
    },
    {
      "slots": [
        {
          "name": "TranslationWord",
          "type": "sampleWords"
        }
      ],
      "intent": "TranslationIntent"
    }
  ]
}