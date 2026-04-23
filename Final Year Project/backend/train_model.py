import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os
import sys

def train():
    dataset_path = os.path.join(os.path.dirname(__file__), 'model_dataset.xlsx')
    print(f"Loading data from {dataset_path}...")
    
    if not os.path.exists(dataset_path):
        print(f"Error: {dataset_path} not found.")
        print("Please ensure you have an Excel file named 'model_dataset.xlsx' in the backend directory.")
        sys.exit(1)
        
    df = pd.read_excel(dataset_path)
    
    if 'review_text' not in df.columns or 'label' not in df.columns:
        print("Error: Excel file must contain 'review_text' and 'label' columns.")
        sys.exit(1)
    
    X = df['review_text']
    y = df['label']
    
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Vectorizing data...")
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    models = {
        'Logistic Regression': LogisticRegression(random_state=42),
        'Naive Bayes': MultinomialNB(),
        'Random Forest': RandomForestClassifier(random_state=42, n_estimators=100)
    }
    
    accuracies = {}
    best_model = None
    best_accuracy = 0
    best_name = ""
    best_y_pred = None
    
    print("Training and comparing models...")
    for name, model in models.items():
        model.fit(X_train_vec, y_train)
        y_pred = model.predict(X_test_vec)
        acc = accuracy_score(y_test, y_pred)
        accuracies[name] = acc
        print(f"{name} Accuracy: {acc:.4f}")
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_model = model
            best_name = name
            best_y_pred = y_pred

    print(f"\nBest Model Selected: {best_name} with {best_accuracy:.4f} accuracy")
    print("\nClassification Report (Best Model):")
    print(classification_report(y_test, best_y_pred))
    
    classes = best_model.classes_
    
    # Plot Accuracy Comparison Graph
    plt.figure(figsize=(10, 6))
    sns.barplot(x=list(accuracies.keys()), y=list(accuracies.values()), hue=list(accuracies.keys()), legend=False, palette='viridis')
    plt.title('Model Accuracy Comparison')
    plt.ylabel('Accuracy')
    plt.ylim(0, 1.0)
    
    for i, acc in enumerate(accuracies.values()):
        plt.text(i, acc + 0.01, f"{acc:.4f}", ha='center')
        
    acc_path = os.path.join(os.path.dirname(__file__), 'accuracy_comparison.png')
    plt.savefig(acc_path)
    plt.close()
    print(f"Saved accuracy comparison graph as '{acc_path}'")
    
    # Plot Confusion Matrix for the Best Model
    cm = confusion_matrix(y_test, best_y_pred, labels=classes)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=classes, yticklabels=classes)
    plt.title(f'Confusion Matrix - {best_name}')
    plt.ylabel('Actual Label')
    plt.xlabel('Predicted Label')
    
    cm_path = os.path.join(os.path.dirname(__file__), 'confusion_matrix.png')
    plt.savefig(cm_path)
    plt.close()
    print(f"Saved confusion matrix as '{cm_path}'")
    
    # Save the best model
    pipeline = Pipeline([
        ('tfidf', vectorizer),
        ('clf', best_model)
    ])
    model_path = os.path.join(os.path.dirname(__file__), 'model.joblib')
    joblib.dump(pipeline, model_path)
    print(f"Model saved to {model_path}")

if __name__ == '__main__':
    train()
