import joblib
import pandas as pd
import re

model = joblib.load('C:/Users/HP/OneDrive/Desktop/FAKE 2/backend/model.joblib')
review = "This product is amazing and the best ever. I highly recommend it to everyone."
words = list(set(re.findall(r'\b[a-zA-Z]{3,}\b', review.lower())))
probs = model.predict_proba(words)

classes = list(model.classes_)
print("Classes:", classes)
fake_idx = classes.index('Fake')

for w, p in zip(words, probs):
    print(f"{w}: Fake={p[fake_idx]:.3f}, Real={p[1-fake_idx]:.3f}")
