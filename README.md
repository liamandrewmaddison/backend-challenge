# Pynea Backend Challenge

## Projects Details

A NodeJS Application running on NestJS & GraphQL. This project runs follows the criteria mentioned [here](https://teampynea.notion.site/Backend-Hiring-Challenge-NestJS-de26c804d8bb42e589dde964e044fa30).

## Running the application

##### Prequesites
* You must have docker installed, I'd reccommend installing [Docker Desktop](https://docs.docker.com/desktop/).
  * This will install all necessary commands and software to run the application


##### Steps

1. Clone this repository `git clone https://github.com/liamandrewmaddison/backend-challenge.git`.
2. In your terminal, at the route of the application run `docker-compose up`.
   1. This will build your application and run it on port 3000.
3. Once everything builds, go to `http://localhost:3000/graphql` in your browser


## GraphQL Examples

### createUser
```
mutation {
  createUser(data: {
    email: "test@test.com",
    name: "Liam Maddison"
  })
  {
    id,
    name,
    email
  }
}
```

### updateUser
```
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
```
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
```
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