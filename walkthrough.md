# Real Machine Learning Model Implementation

We have successfully replaced the simulated fake review detection logic with a real Machine Learning pipeline using `scikit-learn`. The updated architecture now supports training a text classification model using TF-IDF and Logistic Regression.

## Changes Made

### 1. Updated Backend Dependencies
- **File**: [backend/requirements.txt](file:///c:/Users/HP/OneDrive/Desktop/FAKE%202/backend/requirements.txt)
- Added the following libraries required for machine learning and data parsing:
  - `scikit-learn` for building the `TfidfVectorizer` and `LogisticRegression` pipeline.
  - `pandas` for dataset manipulation.
  - `joblib` for securely saving and loading the trained model.

### 2. Created the Training Script
- **File**: [backend/train_model.py](file:///c:/Users/HP/OneDrive/Desktop/FAKE%202/backend/train_model.py)
- We built a standalone Python script to handle the model training process. 
- **Dataset**: Embedded a starter dataset with 20 sample real and fake review strings (similar to Yelp or Amazon structure) so the model can learn basic patterns.
- **Pipeline**: Created a Scikit-Learn `Pipeline` that first vectorizes the text using `TfidfVectorizer` (with English stop words removed), then classifies the vectors using a `LogisticRegression` model.
- **Save Artifact**: After training and evaluation (accuracy, precision, recall), the script saves the pipeline out to `backend/model.joblib`.

### 3. Integrated Live Predictions into the App
- **File**: [backend/app.py](file:///c:/Users/HP/OneDrive/Desktop/FAKE%202/backend/app.py)
- Added model importing logic at application startup. If `model.joblib` exists, it uses `joblib` to load the model into memory.
- In the `/api/analyze` endpoint replacing the `random.choice` block:
  - When a review text comes in, it runs `model.predict([review_text])` to determine if it is a `Fake` or `Real` review.
  - It runs `model.predict_proba([review_text])` to extract the probability / confidence score of the prediction.
  - Retained a fallback safe-fail to the simulated random logic in case the model failed to load or the [train_model.py](file:///c:/Users/HP/OneDrive/Desktop/FAKE%202/backend/train_model.py) script hasn't been run yet.

## Next Steps to Verify
1. Accept the background terminal command to install the new dependencies: `pip install scikit-learn pandas joblib`.
2. Run the newly created training script: `python backend/train_model.py`. This will load the sample dataset, evaluate the accuracy, and write `model.joblib` to your backend folder.
3. Restart your [app.py](file:///c:/Users/HP/OneDrive/Desktop/FAKE%202/backend/app.py) Flask server. It will now successfully log "Model loaded successfully." instead of the missing warning.
4. Try adding new reviews on the frontend dashboard to see the real ML predictions come through!
