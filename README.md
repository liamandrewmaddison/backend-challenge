# Pynea Backend Challenge

## Projects Details

A NodeJS Application running on NestJS & GraphQL. This project runs follows the criteria mentioned [here](https://teampynea.notion.site/Backend-Hiring-Challenge-NestJS-de26c804d8bb42e589dde964e044fa30).

## Running the application

##### Prequesites

* You must have docker installed, I'd reccommend installing [Docker Desktop](https://docs.docker.com/desktop/).
  * This will install all necessary commands and software to run the application


##### Steps

1. Clone this repository `git clone https://github.com/liamandrewmaddison/backend-challenge.git`.
2. In your terminal, at the route of the application run `docker-compose up`.
   1. This will build your application and run it on port 3000.
3. Once everything builds, go to `http://localhost:3000/graphql` in your browser


## GraphQL Examples

### createUser
```graphql
mutation {
  createUser(data: {
    email: "test@test.com",
    name: "Liam Maddison",
    password: "test"
  })
  {
    id,
    name,
    email,
    password,
  }
}
```

### updateUser
```graphql
mutation {
  updateUser(
    where: { id: 1 },
    data: { name: "New Name" }
  )
  {
    id,
    name,
    email,
    updatedAt
  }
}
```

### getUser

This method is protected by an Auth Guard, so you need to pass authorization token:

```json
{
  "Authorization": "Bearer ${token}"
}
```

You can check how to login below.

```graphql
{
  getUser(where: { id: 1 })
  {
    id,
    name,
    email
  }
}
```

### listUsers
```graphql
{
  listUsers(
    page: { page: 0 },
  ) {
    id,
    name,
    email,
    createdAt,
    updatedAt
  }
}
```

```graphql
{
  listUsers(
    page: { page: 0 },
    filter: { name: "j" },
    orderBy: { id: "asc" },
  ) {
    id,
    name,
    email,
    createdAt,
    updatedAt
  }
}
```

### login

Here we can login and extract the token for usage on the getUser endpoint

```graphql
mutation {
  login(data: {
    email: "test@test.com",
    password: "test",
  })
  {
    id,
    email,
    name,
    token,
  }
}
```