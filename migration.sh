name=$1
npx sequelize-cli migration:generate --name $name
migration_path=$(find ./src/db/migrations -type f -printf "%p\n" | sort -n | tail -1)
migration_name=$(basename "$migration_path")
migration_name="${migration_name%.*}"
migration_dirname=./src/db/schema/"$migration_name"
mkdir "$migration_dirname"
touch "$migration_dirname"/index.js
