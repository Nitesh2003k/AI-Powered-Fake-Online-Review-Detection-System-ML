import pandas as pd

# Creating a sample dataset with long, clear, meaningful reviews.
# Correctly labeling both positive and negative legitimate reviews as 'Real'.
# Labeling deceptive, spammy, or overly promotional reviews as 'Fake'.

data = {
    'review_text': [
        "I recently bought this smart TV and I'm very impressed. The screen resolution works exactly as described, and after using it for a few weeks, I can safely recommend it. The remote control design was a pleasant surprise.",
        "After extensive research, I settled on this vacuum cleaner. It arrived on time. The suction power is solid, though the packaging could be slightly improved. Still, a strong 4/5 stars.",
        "This mechanical keyboard exceeded my expectations. I mainly use it for heavy gaming, and it handles it flawlessly. Customer support is top-notch. Highly recommended.",
        "I had high hopes for this smartwatch, but it fell short. The screen broke after two days of normal use. Customer service was unhelpful regarding the warranty. I cannot recommend this.",
        "Unfortunately, this coffee maker did not meet my expectations. While the packaging is okay, the interface is extremely clunky and frustrating for daily use. I will be returning it.",
        "Two stars. The laptop looks nice out of the box, but the cooling system is poorly designed. I constantly struggle with it overheating. Not worth the current price tag.",
        "I've had this blender for a month now. It's incredibly helpful for meal prep. Customer support was also very helpful when I had a minor question. Overall, a fantastic purchase.",
        "Great value for the price. The office chair feels well-built. I appreciate the attention to detail in the ergonomics. It's not perfect, but I am very satisfied.",
        "Solid smartphone. It does what it claims. The battery life is very durable. I've recommended it to several colleagues already who need it for working from home.",
        "I'm disappointed with this monitor. The power supply started malfunctioning right away. Considering how much they charge, the overall build should be of much higher quality.",
        "BEST smartwatch EVER!!! Buy it now!!! It changed my life in one day! I am rich now! screen screen screen!!!",
        "I was actually paid to write this review by the seller. It is a good laptop. Please buy it.",
        "Do not buy from this store! They are scammers! The blender gave me a scary disease and my dog ran away. Terrible terrible terrible!",
        "Amazing wow incredible absolutely fantastic magnificent sublime perfection. Buy buy buy! 10/10 best thing ever!",
        "Click here to get a free smartphone!!! >>>> bit.ly/spam-link-1234. Work from home and make $5000 a week easily!",
        "The vacuum cleaner is a miracle. I used it once and instantly lost 50 pounds. Science cannot explain it. The suction power is magic.",
        "Very good very nice I like it so much best thing wow office chair ergonomics. Excellent wow friend buy.",
        "Terrible coffee maker! Boycott this company! The CEO eats puppies! Zero stars! Do not buy this garbage!",
        "I have been using this headphones for 200 years and it still works like brand new. Thank you anonymous seller!",
        "This monitor instantly solved all my financial problems and I am now debt free. Buy this exact model today."
    ],
    'label': ['Real'] * 10 + ['Fake'] * 10
}

df = pd.DataFrame(data)
df.to_excel("dataset.xlsx", index=False)
print("dataset.xlsx generated successfully!")
