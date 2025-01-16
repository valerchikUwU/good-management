// import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
// import { ControlPanelCreateDto } from "src/contracts/controlPanel/create-controlPanel.dto";


// export function hasPersonalPanelPostId(validationOptions: ValidationOptions){
//     return function (object: Object, propertyName: string){
//         registerDecorator({
//             name: 'hasPersonalPanelPostId',
//             target: object.constructor,
//             propertyName: propertyName,
//             options: validationOptions,
//             validator: {
//                 validate(value: ControlPanelCreateDto, args: ValidationArguments){
//                     const dto = args.object as any;
//                     if(dto.)
//                 }
//             }
//         })
//     }
// }