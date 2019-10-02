### Requirements

- Install Python 3 with your distributions package manager
- If Tkinter isn't supplied with your Python, be sure to install it too
- Download the required Python packages from `./requirements.txt` or use this script to create a complete virtual enviroment in `./env/` 

```sh
python3 -m pip --user install virtualenv
python3 -m venv --no-site-packages --distribute .env &&
source .env/bin/activate &&
pip install -r requirements.txt
```

