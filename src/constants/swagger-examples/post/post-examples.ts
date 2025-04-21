export const findAllContactsExample = [
    {
      "id": "88fd21e0-a67a-4edf-8cac-0be1e7011480",
      "postName": "СЫН ДРОЧУНА11111111",
      "divisionName": "Подразделение №2",
      "createdAt": "2025-02-13T17:18:44.349Z",
      "updatedAt": "2025-03-11T15:59:37.891Z",
      "userId": "0618825d-3564-4c3b-8a6a-cc245e766ea7",
      "userFirstName": "Илья",
      "userLastName": "Белописькин",
      "userTelegramId": 388089893,
      "userTelephoneNumber": "+79787294592",
      "userAvatar": "app/uploads/photo_17-03-2025_13-58-20_c9c78ff7-8b64-4f3d-99b9-e10a7d2b804c.jpg",
      "watcherUnseenCount": "0",
      "unseenMessagesCount": "1"
    },
    {
      "id": "5c848447-2431-4a28-b462-0747af5b92eb",
      "postName": "Валера1111122222",
      "divisionName": "Подразделение №3",
      "createdAt": "2025-02-13T17:31:53.419Z",
      "updatedAt": "2025-03-11T15:54:55.340Z",
      "userId": "f76cac23-3f61-4e26-b3f7-9120e6ebd837",
      "userFirstName": "Валера",
      "userLastName": "Лысенко",
      "userTelegramId": 803348257,
      "userTelephoneNumber": "+79787512027",
      "userAvatar": "app/uploads/photo_19-03-2025_13-40-38_fb349cf3-8348-43bc-b7e5-dce1319d0956.gif",
      "watcherUnseenCount": null,
      "unseenMessagesCount": "2"
    }
  ]



export const findAllPostsExample = [
    {
        "id": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
        "postName": "Post",
        "divisionName": "Подразделение №69",
        "divisionNumber": 69,
        "parentId": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
        "product": "fasf",
        "purpose": "sfsf",
        "createdAt": "2024-12-05T20:28:06.763Z",
        "updatedAt": "2024-12-05T20:28:06.763Z",
        "user": {
            "id": "bc807845-08a8-423e-9976-4f60df183ae2",
            "firstName": "Максим",
            "lastName": "Ковальская",
            "middleName": "Тимофеевич",
            "telegramId": 453120600,
            "telephoneNumber": "+79787513901",
            "avatar_url": null,
            "vk_id": null,
            "createdAt": "2024-12-04T13:16:56.785Z",
            "updatedAt": "2024-12-04T15:37:36.501Z"
        }
    },
    {
        "id": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
        "postName": "чясми",
        "divisionName": "Подразделение №66",
        "divisionNumber": 66,
        "parentId": null,
        "product": "ясчм",
        "purpose": "яывсачм",
        "createdAt": "2024-12-04T15:50:26.335Z",
        "updatedAt": "2024-12-06T13:34:56.291Z",
        "user": null
    }
]


export const beforeCreateExample = {
    "workers": [
        {
            "id": "bc807845-08a8-423e-9976-4f60df183ae2",
            "firstName": "Максим",
            "lastName": "Ковальская",
            "middleName": "Тимофеевич",
            "telegramId": 453120600,
            "telephoneNumber": "+79787513901",
            "avatar_url": null,
            "vk_id": null,
            "createdAt": "2024-12-04T13:16:56.785Z",
            "updatedAt": "2024-12-04T15:37:36.501Z"
        }
    ],
    "policies": [
        {
            "id": "6cf3e08d-8baf-4870-a0ea-18f368e97872",
            "policyName": "Привет",
            "policyNumber": 152,
            "state": "Активный",
            "type": "Директива",
            "dateActive": "2024-12-20T11:14:27.156Z",
            "content": "**Привет**![фыв](http://localhost:5000/uploads/1734018563193-Yanukovich.jpg \"фыв\")",
            "createdAt": "2024-12-12T13:30:48.085Z",
            "updatedAt": "2024-12-20T11:14:27.436Z"
        }
    ],
    "posts": [
        {
            "id": "993b64bc-1703-415a-89a9-6e191b3d46bb",
            "postName": "asdsads",
            "divisionName": "Подразделение №65",
            "divisionNumber": 65,
            "parentId": null,
            "product": "asd",
            "purpose": "sadsad",
            "createdAt": "2024-12-04T15:12:11.525Z",
            "updatedAt": "2024-12-05T19:54:57.861Z"
        }
    ],
    "maxDivisionNumber": 71
}



export const findOnePostExample = {
    "currentPost": {
        "id": "993b64bc-1703-415a-89a9-6e191b3d46bb",
        "postName": "asdsads",
        "divisionName": "Подразделение №65",
        "divisionNumber": 65,
        "parentId": null,
        "product": "asd",
        "purpose": "sadsad",
        "createdAt": "2024-12-04T15:12:11.525Z",
        "updatedAt": "2024-12-05T19:54:57.861Z",
        "user": {
            "id": "39142b0d-3166-4cd7-b663-270ff064479c",
            "firstName": "Дмитрий",
            "lastName": "Климов",
            "middleName": null,
            "telegramId": 1587439475,
            "telephoneNumber": "+79852300581",
            "avatar_url": null,
            "vk_id": null,
            "createdAt": "2024-12-04T14:48:20.726Z",
            "updatedAt": "2024-12-06T10:02:45.285Z"
        },
        "policy": {
            "id": "bae516be-92fe-4f6d-83a0-fefdbffc2924",
            "policyName": "Для Максика",
            "policyNumber": 140,
            "state": "Активный",
            "type": "Директива",
            "dateActive": "2024-12-04T13:29:07.047Z",
            "content": "content",
            "createdAt": "2024-12-04T14:07:05.408Z",
            "updatedAt": "2024-12-16T11:16:38.554Z"
        },
        "statistics": [
            {
                "id": "1aa4399e-671c-44ee-bad3-2f01554c7f0a",
                "type": "Прямая",
                "name": "Статистика2",
                "description": "gg",
                "createdAt": "2024-12-05T20:47:26.358Z",
                "updatedAt": "2024-12-17T15:48:12.579Z"
            },
            {
                "id": "8dace696-59a8-451e-91df-31b18e267337",
                "type": "Обратная",
                "name": "Статистика3",
                "description": null,
                "createdAt": "2024-12-06T08:52:05.820Z",
                "updatedAt": "2024-12-17T15:48:12.586Z"
            }
        ],
        "organization": {
            "id": "2d1cea4c-7cea-4811-8cd5-078da7f20167",
            "organizationName": "Калоеды",
            "parentOrganizationId": null,
            "reportDay": 5,
            "colorCodes": ["#FFFFF", "#AAAAA"],
            "organizationColor": '#FFFFF',
            "createdAt": "2024-12-04T13:14:47.767Z",
            "updatedAt": "2024-12-06T07:09:10.117Z"
        },
        "isHasChildPost": false
    },
    "posts": [
        {
            "id": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
            "postName": "Post",
            "divisionName": "Подразделение №69",
            "divisionNumber": 69,
            "parentId": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
            "product": "fasf",
            "purpose": "sfsf",
            "createdAt": "2024-12-05T20:28:06.763Z",
            "updatedAt": "2024-12-05T20:28:06.763Z",
            "user": {
                "id": "bc807845-08a8-423e-9976-4f60df183ae2",
                "firstName": "Максим",
                "lastName": "Ковальская",
                "middleName": "Тимофеевич",
                "telegramId": 453120600,
                "telephoneNumber": "+79787513901",
                "avatar_url": null,
                "vk_id": null,
                "createdAt": "2024-12-04T13:16:56.785Z",
                "updatedAt": "2024-12-04T15:37:36.501Z"
            }
        }
    ],
    "workers": [
        {
            "id": "bc807845-08a8-423e-9976-4f60df183ae2",
            "firstName": "Максим",
            "lastName": "Ковальская",
            "middleName": "Тимофеевич",
            "telegramId": 453120600,
            "telephoneNumber": "+79787513901",
            "avatar_url": null,
            "vk_id": null,
            "createdAt": "2024-12-04T13:16:56.785Z",
            "updatedAt": "2024-12-04T15:37:36.501Z"
        }
    ],
    "policiesActive": [
        {
            "id": "6cf3e08d-8baf-4870-a0ea-18f368e97872",
            "policyName": "Привет",
            "policyNumber": 152,
            "state": "Активный",
            "type": "Директива",
            "dateActive": "2024-12-20T11:14:27.156Z",
            "content": "**Привет**![фыв](http://localhost:5000/uploads/1734018563193-Yanukovich.jpg \"фыв\")",
            "createdAt": "2024-12-12T13:30:48.085Z",
            "updatedAt": "2024-12-20T11:14:27.436Z"
        }
    ]
}


export const findAllUnderPostsExample = [
    {
        "id": "9ad461a7-9e13-4f40-a1e3-8090be47771a",
        "postName": "Тест 2",
        "divisionName": "Подразделение №73",
        "divisionNumber": 7,
        "parentId": "9b6596ea-be16-4b97-a579-cab6b7d722b0",
        "product": "Тест 2",
        "purpose": "Тест 2",
        "createdAt": "2024-12-25T13:01:55.517Z",
        "updatedAt": "2024-12-25T13:01:55.517Z",
        "user": null
    },
    {
        "id": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
        "postName": "постецкий",
        "divisionName": "Подразделение №66",
        "divisionNumber": 66,
        "parentId": "9ad461a7-9e13-4f40-a1e3-8090be47771a",
        "product": "ясчмп",
        "purpose": "яывсачм",
        "createdAt": "2024-12-04T15:50:26.335Z",
        "updatedAt": "2025-01-15T09:57:05.584Z",
        "user": {
            "id": "0618825d-3564-4c3b-8a6a-cc245e766ea7",
            "firstName": "Илья",
            "lastName": "Белописькин",
            "middleName": null,
            "telegramId": 388089893,
            "telephoneNumber": "+79787294592",
            "avatar_url": null,
            "vk_id": null,
            "createdAt": "2024-12-24T18:38:17.034Z",
            "updatedAt": "2024-12-24T18:39:06.592Z"
        }
    }
]


export const findAllMyPostsExample = [
    {
        "id": "5fc5ec49-d658-4fe1-b4c9-7dd01d38a652",
        "postName": "ДРОЧУН",
        "divisionName": "Подразделение №2",
        "divisionNumber": 1,
        "parentId": null,
        "product": "СУКА",
        "purpose": "СУЧКА",
        "createdAt": "2025-02-13T17:17:59.999Z",
        "updatedAt": "2025-02-13T17:17:59.999Z"
    },
    {
        "id": "154387db-f8de-4439-8a88-4c54ab97f863",
        "postName": "ЖЕНА ДРОЧУНА",
        "divisionName": "Подразделение №3",
        "divisionNumber": 4,
        "parentId": null,
        "product": "ЖЕНА ПИЗДА",
        "purpose": "Я ФЕМКА",
        "createdAt": "2025-02-13T17:34:39.688Z",
        "updatedAt": "2025-02-13T17:34:39.688Z"
    },
    {
        "id": "4e44595c-b91f-43e7-88ca-438451383815",
        "postName": "22222222222",
        "divisionName": "Подразделение №7",
        "divisionNumber": 7,
        "parentId": "1696c818-4862-4619-ba6a-f430e4bb62ba",
        "product": "222",
        "purpose": "222",
        "createdAt": "2025-02-13T17:40:26.351Z",
        "updatedAt": "2025-02-13T17:40:26.351Z"
    }
]