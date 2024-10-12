#!/bin/bash
cd "$(dirname "$0")/test"  # 切换到test目录
source "./test_env/bin/activate"
python "./test_api_call.py"
deactivate
