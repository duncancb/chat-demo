#!/usr/bin/env bash

psql -U postgres -a -f /sql/create_db.sql
PGPASSWORD='chat_pass'
psql -U chat_user -d chat -a -f /sql/create_tables.sql
