from labconfig import CONFIG
from pathlib import Path
from typing import Dict, List
import csv

def load_experiment(name: str) -> Dict[str, List]: 
    fname = name.lower().replace(' ', '_')
    save_dir = Path(CONFIG['motion_tracker']['recording']['save_directory'])
    dir_path = save_dir / fname

    fpaths = sorted(dir_path.glob('*.csv'))
    results = dict()
    for fpath in fpaths:
        data = []
        with open(fpath, 'r', newline='') as fp:
            data_reader = csv.DictReader(fp, delimiter=',')
            for row in data_reader:
                data.append(row)
        results[fpath.stem] = data
    return results

