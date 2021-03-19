# external imports
import os, random, base64
from flask import Flask, jsonify, send_from_directory
from flask.globals import request

# vars
STATIC_DIR = 'static/'
FILES_DIR = STATIC_DIR + "files/"

# create flask app
app = Flask(__name__, static_url_path='/', static_folder=STATIC_DIR)

# util
def get_current_pins():
    return next(os.walk(FILES_DIR))[1]

def get_new_pin():
    existing = set(get_current_pins())
    possibilities = set(range(100000, 999999))
    return str(random.choice(list(possibilities - existing)))

# get files from pin
@app.route("/api/<pin>")
def get_files_from_pin(pin):
    if(pin not in get_current_pins()):
        return jsonify({
            "error": "Pin does not exist."
        }), 400
    else:
        pin_dir = FILES_DIR + pin + "/"
        files = next(os.walk(pin_dir))[2]
        return jsonify({
            "file": "/files/" + pin + "/" + files[0],
            "filename": files[0]
        })

# upload files
@app.route('/api/', methods=['POST'])
def upload_file():
    pin = get_new_pin()
    file_dir = FILES_DIR + pin + "/"
    filename = request.json['filename']
    file_path = file_dir + filename
    os.mkdir(file_dir)
    f = open(file_path, 'wb+')
    f.write(base64.b64decode(request.json['file'].encode('ascii')))
    f.close()
    return jsonify({
        "pin": pin,
        "name": filename
    })

# site
@app.route('/')
def root():
    return app.send_static_file('index.html')

# run the app
if __name__ == "__main__":
    app.run(debug=True)