# This required httpie to work correctly:
# https://httpie.org/
http post http://localhost:8080/api/v1/shelves title="Want"
http post http://localhost:8080/api/v1/shelves title="In progress"
http post http://localhost:8080/api/v1/shelves title="Completed"

wantId=`http get http://localhost:8080/api/v1/shelves | python -c "import json,sys; print json.load(sys.stdin)[0]['id']"`

http post http://localhost:8080/api/v1/works shelf_id:=$wantId title="The Disposessed" author="Ursula K. Le Guin"
http post http://localhost:8080/api/v1/works shelf_id:=$wantId title="New York 2140" author="Kim Stanley Robinson"
http post http://localhost:8080/api/v1/works shelf_id:=$wantId title="1984" author="George Orwell"
