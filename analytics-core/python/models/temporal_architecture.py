class TemporalAnalyzer:
    def __init__(self, timestamps):
        self.timestamps = timestamps
        self.gaps = []

    def compute_gaps(self):
        self.gaps = [self.timestamps[i+1] - self.timestamps[i] for i in range(len(self.timestamps)-1)]
        return self.gaps

    def mean_gap(self):
        return sum(self.gaps) / len(self.gaps) if self.gaps else 0

    def detect_outliers(self, threshold=1.5):
        avg = self.mean_gap()
        return [gap for gap in self.gaps if gap > threshold * avg]

    def is_sync_required(self):
        return any(gap > 1000 for gap in self.gaps)

    def apply_correction(self, correction_value):
        self.timestamps = [ts + correction_value for ts in self.timestamps]
        return self.timestamps


class SequenceForecaster:
    def __init__(self, data):
        self.data = data

    def linear_projection(self, steps=5):
        if len(self.data) < 2:
            return []
        delta = self.data[-1] - self.data[-2]
        return [self.data[-1] + delta * (i+1) for i in range(steps)]

    def rolling_average(self, window=3):
        if len(self.data) < window:
            return []
        return [sum(self.data[i:i+window])/window for i in range(len(self.data)-window+1)]

    def gradient(self):
        return [self.data[i+1] - self.data[i] for i in range(len(self.data)-1)]

    def classify_trend(self):
        grad = self.gradient()
        if all(g > 0 for g in grad):
            return 'uptrend'
        elif all(g < 0 for g in grad):
            return 'downtrend'
        else:
            return 'mixed'

    def trend_strength(self):
        grad = self.gradient()
        return sum(abs(g) for g in grad) / len(grad) if grad else 0
