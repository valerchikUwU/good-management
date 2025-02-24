export const findAllTargetsExample = {
    "userPosts": [
        {
            "id": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
            "postName": "Post",
            "divisionName": "Подразделение №69",
            "divisionNumber": 69,
            "parentId": "f66e6dd0-0b7d-439b-b742-5e8fc2ebc1c0",
            "product": "fasf",
            "purpose": "sfsf",
            "createdAt": "2024-12-05T20:28:06.763Z",
            "updatedAt": "2024-12-05T20:28:06.763Z"
        },
        {
            "id": "261fcded-bb76-4956-a950-a19ab6e2c2fd",
            "postName": "Ковальская",
            "divisionName": "Подразделение №73",
            "divisionNumber": 11,
            "parentId": null,
            "product": "Ковальская",
            "purpose": "Ковальская",
            "createdAt": "2025-01-14T15:58:12.214Z",
            "updatedAt": "2025-01-14T15:58:12.214Z"
        }
    ],
    "personalTargets": [
        {
            "id": "b123fb06-4d9d-44c6-824a-100629fb764a",
            "type": "Личная",
            "orderNumber": 1,
            "content": "Контент задачи",
            "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
            "targetState": "Активная",
            "dateStart": "2024-12-25T10:45:37.697Z",
            "deadline": "2024-09-18T14:59:47.010Z",
            "dateComplete": null,
            "createdAt": "2024-12-25T10:45:37.923Z",
            "updatedAt": "2024-12-25T10:45:37.923Z",
            "policy": null,
            "attachmentToTargets": [
                {
                    "id": "82cb83b3-dbde-4a22-a7d8-cb042854bf0f",
                    "createdAt": "2025-01-29T13:47:10.678Z",
                    "updatedAt": "2025-01-29T13:47:10.678Z",
                    "attachment": {
                        "id": "6750fe5b-7f47-4828-9b42-5dd902875224",
                        "attachmentName": "1738156848746--wXW1G9b1iI.jpg",
                        "attachmentPath": "uploads/1738156848746--wXW1G9b1iI.jpg",
                        "attachmentSize": 957667,
                        "attachmentMimetype": "image/jpeg",
                        "hash": "ff80c55fa1d38c114bdc14c587c75894fab21b3db71cd941bc1b46b37dfaeaaf",
                        "createdAt": "2025-01-29T13:20:48.877Z",
                        "updatedAt": "2025-01-29T13:20:48.877Z"
                    }
                }
            ]
        },
    ],
    "ordersTargets": [
        {
            "id": "qqqqfb06-4d9d-44c6-824a-100629fb764a",
            "type": "Приказ",
            "orderNumber": 1,
            "content": "Контент задачи",
            "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
            "targetState": "Активная",
            "dateStart": "2024-12-25T10:45:37.697Z",
            "deadline": "2024-09-18T14:59:47.010Z",
            "dateComplete": null,
            "createdAt": "2024-12-25T10:45:37.923Z",
            "updatedAt": "2024-12-25T10:45:37.923Z",
            "attachmentToTargets": [
                {
                    "id": "82cb83b3-dbde-4a22-a7d8-cb042854bf0f",
                    "createdAt": "2025-01-29T13:47:10.678Z",
                    "updatedAt": "2025-01-29T13:47:10.678Z",
                    "attachment": {
                        "id": "6750fe5b-7f47-4828-9b42-5dd902875224",
                        "attachmentName": "1738156848746--wXW1G9b1iI.jpg",
                        "attachmentPath": "uploads/1738156848746--wXW1G9b1iI.jpg",
                        "attachmentSize": 957667,
                        "attachmentMimetype": "image/jpeg",
                        "hash": "ff80c55fa1d38c114bdc14c587c75894fab21b3db71cd941bc1b46b37dfaeaaf",
                        "createdAt": "2025-01-29T13:20:48.877Z",
                        "updatedAt": "2025-01-29T13:20:48.877Z"
                    }
                }
            ]
        },
    ],
    "projectTargets": [
        {
            "id": "a008fb06-4d9d-44c6-824a-100629fb764a",
            "type": "Продукт",
            "orderNumber": 1,
            "content": "Контент задачи",
            "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
            "targetState": "Активная",
            "dateStart": "2024-12-25T10:45:37.697Z",
            "deadline": "2024-09-18T14:59:47.010Z",
            "dateComplete": null,
            "createdAt": "2024-12-25T10:45:37.923Z",
            "updatedAt": "2024-12-25T10:45:37.923Z"
        },
    ]
}

export const findAllArchiveExample = {
    "userPosts": [
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
            "organization": {
                "id": "2d1cea4c-7cea-4811-8cd5-078da7f20167",
                "organizationName": "Калоеды",
                "parentOrganizationId": null,
                "reportDay": 5,
                "colorCodes": ["#FFFFF", "#AAAAA"],
                "createdAt": "2024-12-04T13:14:47.767Z",
                "updatedAt": "2025-01-17T13:18:56.549Z"
            }
        },
        {
            "id": "261fcded-bb76-4956-a950-a19ab6e2c2fd",
            "postName": "Ковальская",
            "divisionName": "Подразделение №73",
            "divisionNumber": 11,
            "parentId": null,
            "product": "Ковальская",
            "purpose": "Ковальская",
            "createdAt": "2025-01-14T15:58:12.214Z",
            "updatedAt": "2025-01-14T15:58:12.214Z",
            "organization": {
                "id": "2d1cea4c-7cea-4811-8cd5-078da7f20167",
                "organizationName": "Калоеды",
                "parentOrganizationId": null,
                "reportDay": 5,
                "colorCodes": ["#FFFFF", "#AAAAA"],
                "createdAt": "2024-12-04T13:14:47.767Z",
                "updatedAt": "2025-01-17T13:18:56.549Z"
            }
        }
    ],
    "personalArchiveTargets": [
        {
            "id": "b123fb06-4d9d-44c6-824a-100629fb764a",
            "type": "Личная",
            "orderNumber": 1,
            "content": "Контент задачи",
            "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
            "targetState": "Активная",
            "dateStart": "2024-12-25T10:45:37.697Z",
            "deadline": "2024-09-18T14:59:47.010Z",
            "dateComplete": "2025-01-15T14:59:47.010Z",
            "createdAt": "2024-12-25T10:45:37.923Z",
            "updatedAt": "2024-12-25T10:45:37.923Z",
            "policy": null,
            "attachmentToTargets": [
                {
                    "id": "82cb83b3-dbde-4a22-a7d8-cb042854bf0f",
                    "createdAt": "2025-01-29T13:47:10.678Z",
                    "updatedAt": "2025-01-29T13:47:10.678Z",
                    "attachment": {
                        "id": "6750fe5b-7f47-4828-9b42-5dd902875224",
                        "attachmentName": "1738156848746--wXW1G9b1iI.jpg",
                        "attachmentPath": "uploads/1738156848746--wXW1G9b1iI.jpg",
                        "attachmentSize": 957667,
                        "attachmentMimetype": "image/jpeg",
                        "hash": "ff80c55fa1d38c114bdc14c587c75894fab21b3db71cd941bc1b46b37dfaeaaf",
                        "createdAt": "2025-01-29T13:20:48.877Z",
                        "updatedAt": "2025-01-29T13:20:48.877Z"
                    }
                }
            ]
        },
    ],
    "ordersArchiveTargets": [
        {
            "id": "qqqqfb06-4d9d-44c6-824a-100629fb764a",
            "type": "Приказ",
            "orderNumber": 1,
            "content": "Контент задачи",
            "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
            "targetState": "Активная",
            "dateStart": "2024-12-25T10:45:37.697Z",
            "deadline": "2024-09-18T14:59:47.010Z",
            "dateComplete": "2025-01-15T14:59:47.010Z",
            "createdAt": "2024-12-25T10:45:37.923Z",
            "updatedAt": "2024-12-25T10:45:37.923Z",
            "attachmentToTargets": [
                {
                    "id": "82cb83b3-dbde-4a22-a7d8-cb042854bf0f",
                    "createdAt": "2025-01-29T13:47:10.678Z",
                    "updatedAt": "2025-01-29T13:47:10.678Z",
                    "attachment": {
                        "id": "6750fe5b-7f47-4828-9b42-5dd902875224",
                        "attachmentName": "1738156848746--wXW1G9b1iI.jpg",
                        "attachmentPath": "uploads/1738156848746--wXW1G9b1iI.jpg",
                        "attachmentSize": 957667,
                        "attachmentMimetype": "image/jpeg",
                        "hash": "ff80c55fa1d38c114bdc14c587c75894fab21b3db71cd941bc1b46b37dfaeaaf",
                        "createdAt": "2025-01-29T13:20:48.877Z",
                        "updatedAt": "2025-01-29T13:20:48.877Z"
                    }
                }
            ]
        },
    ],
    "projectArchiveTargets": [
        {
            "id": "a008fb06-4d9d-44c6-824a-100629fb764a",
            "type": "Продукт",
            "orderNumber": 1,
            "content": "Контент задачи",
            "holderPostId": "c92895e6-9496-4cb5-aa7b-e3c72c18934a",
            "targetState": "Активная",
            "dateStart": "2024-12-25T10:45:37.697Z",
            "deadline": "2024-09-18T14:59:47.010Z",
            "dateComplete": "2025-01-15T14:59:47.010Z",
            "createdAt": "2024-12-25T10:45:37.923Z",
            "updatedAt": "2024-12-25T10:45:37.923Z"
        },
    ]
}