# Requirements

## Python

- Install Python3
- Download the required Python packages from `./requirements.txt` or use these commands to create a complete virtual enviroment in `./env/` 

```sh
python3 -m pip install virtualenv
python3 -m venv .env &&
source .env/bin/activate &&
pip install -r requirements.txt
```

## JS

- Install Yarn
- Use `yarn install` to install all js dependencies


# Build necessary files

- Use `yarn dev` to compile js
- Use `python3 ./tester/manage.py migrate` to let django build the database


# Run server

- Use `python3 ./tester/manage.py runserver` to run the server on `localhost:8000`


# Populate database

- The frontend will currently crash when no questions are present in the database
- To create new question sets, go to `http://localhost:8000/api/set/create/`
- To create new questions, go to `http://localhost:8000/api/question/create/`