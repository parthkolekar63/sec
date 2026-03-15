import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import google.generativeai as genai
import json
import os

# --- CONFIGURATION ---
# Replace with your actual API key or set it as an environment variable
API_KEY = "AIzaSyC9hMuuX-pr2RmbnM1LNIu4Qo84BiMOvYM" 
genai.configure(api_key=API_KEY)

class PhishingDetectorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("CyberGuard - Phishing Message Detector")
        self.root.geometry("600x700")
        self.root.configure(bg="#0A0A0B")

        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Custom Styles
        self.style.configure("TFrame", background="#0A0A0B")
        self.style.configure("TLabel", background="#0A0A0B", foreground="#E4E4E7", font=("Helvetica", 10))
        self.style.configure("Header.TLabel", font=("Helvetica", 16, "bold"), foreground="#10B981")
        self.style.configure("TButton", font=("Helvetica", 10, "bold"), padding=10)

        self.setup_ui()

    def setup_ui(self):
        # Main Container
        main_frame = ttk.Frame(self.root, padding="30")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Header
        header = ttk.Label(main_frame, text="PHISHING DETECTOR", style="Header.TLabel")
        header.pack(pady=(0, 20))

        # Input Label
        input_label = ttk.Label(main_frame, text="PASTE MESSAGE TO ANALYZE:")
        input_label.pack(anchor=tk.W, pady=(0, 5))

        # Text Area
        self.text_input = scrolledtext.ScrolledText(
            main_frame, height=10, bg="#18181B", fg="#E4E4E7", 
            insertbackground="white", font=("Courier New", 10),
            border=0, highlightthickness=1, highlightbackground="#27272A"
        )
        self.text_input.pack(fill=tk.X, pady=(0, 20))

        # Analyze Button
        self.analyze_btn = tk.Button(
            main_frame, text="SCAN FOR PHISHING", command=self.analyze_message,
            bg="#10B981", fg="black", font=("Helvetica", 10, "bold"),
            activebackground="#34D399", border=0, cursor="hand2", pady=10
        )
        self.analyze_btn.pack(fill=tk.X)

        # Result Area
        self.result_frame = ttk.Frame(main_frame)
        self.result_frame.pack(fill=tk.BOTH, expand=True, pady=(20, 0))

        self.result_label = ttk.Label(self.result_frame, text="", wraplength=500, justify=tk.LEFT)
        self.result_label.pack(fill=tk.X)

    def analyze_message(self):
        message = self.text_input.get("1.0", tk.END).strip()
        if not message:
            messagebox.showwarning("Input Error", "Please paste a message to analyze.")
            return

        self.analyze_btn.config(text="ANALYZING...", state=tk.DISABLED)
        self.root.update_idletasks()

        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
            Analyze the following message for phishing indicators. 
            Provide a JSON response with exactly these keys:
            - riskLevel: "Low", "Medium", or "High"
            - score: 0-100
            - redFlags: list of strings
            - analysis: brief explanation

            Message: "{message}"
            """
            
            response = model.generate_content(prompt)
            
            # Clean the response text (sometimes AI adds markdown code blocks)
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:-3].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text[3:-3].strip()

            data = json.loads(raw_text)
            self.display_result(data)

        except Exception as e:
            messagebox.showerror("Error", f"Failed to analyze message: {str(e)}")
        finally:
            self.analyze_btn.config(text="SCAN FOR PHISHING", state=tk.NORMAL)

    def display_result(self, data):
        # Clear previous result
        for widget in self.result_frame.winfo_children():
            widget.destroy()

        risk_color = "#EF4444" if data['riskLevel'] == "High" else "#F59E0B" if data['riskLevel'] == "Medium" else "#10B981"
        
        # Risk Header
        risk_lbl = tk.Label(
            self.result_frame, text=f"{data['riskLevel'].upper()} RISK DETECTED", 
            font=("Helvetica", 12, "bold"), fg=risk_color, bg="#0A0A0B"
        )
        risk_lbl.pack(anchor=tk.W)

        score_lbl = tk.Label(
            self.result_frame, text=f"Threat Score: {data['score']}/100", 
            font=("Helvetica", 10), fg="#71717A", bg="#0A0A0B"
        )
        score_lbl.pack(anchor=tk.W, pady=(0, 10))

        # Analysis
        analysis_lbl = tk.Label(
            self.result_frame, text=data['analysis'], 
            font=("Helvetica", 10, "italic"), fg="#A1A1AA", bg="#0A0A0B",
            wraplength=500, justify=tk.LEFT
        )
        analysis_lbl.pack(anchor=tk.W, pady=(0, 15))

        # Red Flags
        if data['redFlags']:
            flags_title = tk.Label(
                self.result_frame, text="RED FLAGS IDENTIFIED:", 
                font=("Helvetica", 9, "bold"), fg="#52525B", bg="#0A0A0B"
            )
            flags_title.pack(anchor=tk.W)

            for flag in data['redFlags']:
                f_lbl = tk.Label(
                    self.result_frame, text=f"• {flag}", 
                    font=("Helvetica", 9), fg="#E4E4E7", bg="#0A0A0B",
                    wraplength=500, justify=tk.LEFT
                )
                f_lbl.pack(anchor=tk.W, padx=10)

if __name__ == "__main__":
    root = tk.Tk()
    app = PhishingDetectorApp(root)
    root.mainloop()
