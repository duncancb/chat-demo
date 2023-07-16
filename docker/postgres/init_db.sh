#!/usr/bin/env bash

psql -U postgres -a -v app_db=$CHAT_DB -v app_db_user=$CHAT_DB_USER -v app_db_password=$CHAT_DB_PASSWORD -f /sql/create_db.sql
PGPASSWORD='${APP_DB_PASSWORD}'
psql -U $CHAT_DB_USER -d $CHAT_DB -a -f /sql/create_tables.sql
