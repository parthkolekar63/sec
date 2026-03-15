import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'password-checker',
    title: 'Password Strength Checker',
    description: 'A tool that evaluates the strength of a password based on length, complexity, and common patterns.',
    difficulty: 'Beginner',
    category: 'System Security',
    concepts: ['Entropy', 'Regular Expressions', 'Brute-force Resistance'],
    tools: ['JavaScript', 'HTML/CSS'],
    steps: [
      'Define criteria for a strong password (length, symbols, numbers).',
      'Use regex to check for each criterion.',
      'Calculate a score based on met criteria.',
      'Provide real-time feedback to the user.'
    ]
  },
  {
    id: 'encryption-tool',
    title: 'AES Encryption/Decryption Tool',
    description: 'A simple utility to encrypt and decrypt text using the Advanced Encryption Standard (AES).',
    difficulty: 'Intermediate',
    category: 'Cryptography',
    concepts: ['Symmetric Encryption', 'Salting', 'Initialization Vectors (IV)'],
    tools: ['CryptoJS', 'React'],
    steps: [
      'Implement a UI for inputting text and a secret key.',
      'Use a library like CryptoJS to handle AES-256.',
      'Display the resulting ciphertext or decrypted plaintext.',
      'Explain the importance of key management.'
    ]
  },
  {
    id: 'port-scanner',
    title: 'Simple Port Scanner',
    description: 'A script that checks a range of ports on a target IP address to see which ones are open.',
    difficulty: 'Intermediate',
    category: 'Network Security',
    concepts: ['TCP/IP Handshake', 'Networking Protocols', 'Socket Programming'],
    tools: ['Python', 'Socket Library'],
    steps: [
      'Take a target IP or hostname as input.',
      'Iterate through a range of common ports (e.g., 20-1024).',
      'Attempt a socket connection to each port.',
      'Log and display open ports.'
    ]
  },
  {
    id: 'sql-injection-sim',
    title: 'SQL Injection Simulator',
    description: 'An educational environment to demonstrate how SQL injection works and how to prevent it using prepared statements.',
    difficulty: 'Intermediate',
    category: 'Web Security',
    concepts: ['Database Security', 'Input Sanitization', 'Prepared Statements'],
    tools: ['Node.js', 'Express', 'SQLite'],
    steps: [
      'Create a vulnerable login form.',
      'Demonstrate a bypass using "OR 1=1".',
      'Show the backend code causing the vulnerability.',
      'Refactor the code using parameterized queries to fix it.'
    ]
  },
  {
    id: 'phishing-checker',
    title: 'Phishing Link Analyzer',
    description: 'Analyze URLs for common phishing indicators like typosquatting, suspicious TLDs, and hidden redirects.',
    difficulty: 'Beginner',
    category: 'Web Security',
    concepts: ['Social Engineering', 'URL Structure', 'Domain Reputation'],
    tools: ['JavaScript', 'Public APIs (e.g., Google Safe Browsing)'],
    steps: [
      'Parse the URL components (protocol, domain, path).',
      'Check for common tricks like "g00gle.com" or "secure-login-bank.xyz".',
      'Check the domain against known blacklists.',
      'Warn the user about potential risks.'
    ]
  },
  {
    id: 'packet-sniffer-edu',
    title: 'Educational Packet Sniffer',
    description: 'A tool to capture and analyze local network traffic to understand how data flows across the wire.',
    difficulty: 'Advanced',
    category: 'Network Security',
    concepts: ['Promiscuous Mode', 'Packet Headers', 'Wireshark Basics'],
    tools: ['Python', 'Scapy'],
    steps: [
      'Use Scapy to sniff packets on a specific interface.',
      'Filter for specific protocols (HTTP, DNS, ICMP).',
      'Extract and display source/destination IPs and payload summaries.',
      'Discuss the ethical implications of sniffing.'
    ]
  },
  {
    id: 'phishing-detector',
    title: 'Phishing Message Detector',
    description: 'An AI-powered tool that analyzes messages for common phishing indicators like urgent language, suspicious links, and sender impersonation.',
    difficulty: 'Intermediate',
    category: 'Web Security',
    concepts: ['Natural Language Processing', 'Heuristics', 'Social Engineering', 'Pattern Matching'],
    tools: ['Gemini API', 'React', 'Tailwind CSS'],
    steps: [
      'Create a text input for the message content.',
      'Implement heuristic checks for keywords like "urgent", "verify", or "suspended".',
      'Integrate Gemini AI to analyze the intent and tone of the message.',
      'Calculate a risk score based on both heuristic and AI analysis.',
      'Display a detailed breakdown of suspicious elements to the user.'
    ]
  }
];
