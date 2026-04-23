import pandas as pd
import random

# Core components for generating Real Reviews (Positive and Negative)
# Real reviews are detailed, mention specific features, and have balanced tones.

real_positive_templates = [
    "I recently bought this {product} and I'm very impressed. The {feature} works exactly as described, and after using it for a few weeks, I can safely recommend it. The {aspect} was a pleasant surprise.",
    "After extensive research, I settled on this {product}. It arrived on time. The {feature} is solid, though the {aspect} could be slightly improved. Still, a strong 4/5 stars.",
    "This {product} exceeded my expectations. I mainly use it for {use_case}, and it handles it flawlessly. The {aspect} is top-notch. Highly recommended for anyone looking for reliable performance.",
    "Great value for the price. The {product} feels well-built. I appreciate the attention to detail in the {feature}. It's not perfect, as the {aspect} is just average, but I am very satisfied.",
    "I've had this {product} for a month now. It's incredibly helpful for {use_case}. Customer support was also helpful when I had a minor question about the {feature}. Overall, a fantastic purchase.",
    "Solid {product}. It does what it claims. The {aspect} is very intuitive, and the {feature} is durable. I've recommended it to several colleagues already."
]

real_negative_templates = [
    "I had high hopes for this {product}, but it fell short. The {feature} broke after two days of normal use. Customer service was unhelpful regarding the {aspect}. I cannot recommend this.",
    "Unfortunately, this {product} did not meet my expectations. While the {aspect} is okay, the {feature} is extremely clunky and frustrating for {use_case}. I will be returning it.",
    "Two stars. The {product} looks nice out of the box, but the {aspect} is poorly designed. I constantly struggle with the {feature}. Not worth the current price tag.",
    "I'm disappointed with this {product}. The {feature} started malfunctioning right away. Considering how much they charge, the {aspect} should be of much higher quality.",
    "The {product} is mediocre at best. It struggles with {use_case}. The {aspect} feels cheap, and while the {feature} is passable, there are much better alternatives on the market."
]

products = ["laptop", "smartphone", "blender", "vacuum cleaner", "smartwatch", "headphones", "office chair", "coffee maker", "monitor", "keyboard"]
features = ["battery life", "build quality", "motor", "software interface", "Bluetooth connectivity", "ergonomics", "screen resolution", "suction power", "cooling system", "key travel"]
aspects = ["packaging", "instruction manual", "customer support", "setup process", "color options", "overall design", "portability", "weight", "warranty", "accessories"]
use_cases = ["daily commuting", "heavy gaming", "professional video editing", "casual reading", "working from home", "outdoor activities", "gym workouts", "meal prep", "managing schedules", "traveling"]

def generate_real_review():
    is_positive = random.choice([True, True, False]) # More positive than negative
    templates = real_positive_templates if is_positive else real_negative_templates
    template = random.choice(templates)
    return template.format(
        product=random.choice(products),
        feature=random.choice(features),
        aspect=random.choice(aspects),
        use_case=random.choice(use_cases)
    )

# Core components for generating Fake Reviews (Deceptive, spammy, irrelevant)
fake_templates = [
    "BEST {product} EVER!!! Buy it now!!! It changed my life in one day! I am rich now! {feature} {feature} {feature}!!!",
    "I was paid to write this review by the seller. It is a good {product}.",
    "Do not buy from this store! They are scammers! The {product} gave me a scary disease and my dog ran away. Terrible terrible terrible!",
    "Amazing wow incredible absolutely fantastic magnificent sublime perfection. Buy buy buy!",
    "Click here to get a free {product}!!! >>>> bit.ly/spam-link-1234. Work from home and make $5000 a week!",
    "The {product} is a miracle. I used it once and instantly lost 50 pounds. Science cannot explain it. The {feature} is magic.",
    "Very good very nice I like it so much best thing wow {product} {feature}.",
    "Terrible {product}! Boycott this company! The CEO eats puppies! Zero stars!",
    "I have been using this {product} for 200 years and it still works like brand new. Thank you anonymous seller!",
    "This {product} instantly solved all my financial problems and I am now debt free. The {feature} printed money for me.",
]

def generate_fake_review():
    template = random.choice(fake_templates)
    return template.format(
        product=random.choice(products),
        feature=random.choice(features)
    )

if __name__ == '__main__':
    reviews = []
    labels = []
    
    # Generate 2500 Real
    for _ in range(2500):
        reviews.append(generate_real_review())
        labels.append("Real")
        
    # Generate 2500 Fake
    for _ in range(2500):
        reviews.append(generate_fake_review())
        labels.append("Fake")
        
    combined = list(zip(reviews, labels))
    random.shuffle(combined)
    reviews, labels = zip(*combined)
    
    df = pd.DataFrame({
        'review_text': reviews,
        'label': labels
    })
    
    df.to_excel('model_dataset.xlsx', index=False)
    print(f"model_dataset.xlsx with {len(df)} reviews generated successfully!")
