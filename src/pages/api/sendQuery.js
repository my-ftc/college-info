export default function handler(req, res) {
    const randomSentences = [
        "Hello! How can I assist you today?",
        "Did you know that honey never spoils?",
        "The Eiffel Tower can be 15 cm taller during the summer.",
        "Bananas are berries, but strawberries aren't.",
        "A group of flamingos is called a 'flamboyance.'",
    ];

    const randomIndex = Math.floor(Math.random() * randomSentences.length);
    const responseSentence = randomSentences[randomIndex];

    res.status(200).json({ reply: responseSentence });
}
