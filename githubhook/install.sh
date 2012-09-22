
# Figure the script HOME PATH
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ] ; do SOURCE="$(readlink "$SOURCE")"; done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

cd $DIR

npm install
npm update

cp githubhook /etc/init.d

