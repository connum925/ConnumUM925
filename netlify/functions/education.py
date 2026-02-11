import json
from pathlib import Path

def handler(event, context):
    """Get education data"""
    data_file = Path(__file__).parent.parent.parent / 'backend' / 'data' / 'education.json'

    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data)
    }
