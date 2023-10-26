# Frontend

Folder structure:

├── labweb
├── __pycache__/
│   ├── backend
│   └── frontend/
│       ├── components/
│       │   └── * all the funtion components goes here *
│       ├── routes/
│       │   ├── calibration/
│       │   │   └── * the calibration pages (different stages of tracking process) goes here 
│       │   ├── experiment/
│       │   │   └── * experiment pages goes here
│       │   ├── output/
│       │   │   └── * the output page with data goes here
│       │   ├── setting/
│       │   │   └── * setting page 
│       │   ├── root.tsx -> our index file
│       │   └── startpage.tsx -> instruction page (can be used as starter page)
│       ├── api.ts -> API calling functions
│       ├── index.css -> CSS file
│       ├── index.html -> HTML file
│       ├── index.tsx -> TSX file that renders the root div
│       ├── README.md -> Instruction for development related to frontend
│       ├── store.ts -> Store file for Zustand state management
│       └── types.ts -> Types are defined here
├── __init__.py
└── main.py