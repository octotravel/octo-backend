import * as yup from 'yup'

export interface OctoConnectionBackend  {
    type: "octo";
    endpoint: string;
    apiKey: string;
    supplierId: string;
};

export interface OctoConnectionPatchBackend  {
    type: "octo";
    endpoint?: string;
    apiKey?: string;
    supplierId?: string;
};

export const connectionSchema: yup.SchemaOf<OctoConnectionBackend> = yup.object().shape({
    type: yup.string().equals(['octo']).required(),
    endpoint: yup.string().url().required(),
    apiKey: yup.string().required(),
    supplierId: yup.string().required(),
});

export const connectionPatchSchema: yup.SchemaOf<OctoConnectionPatchBackend> = yup.object().shape({
    type: yup.string().equals(['octo']).required(),
    endpoint: yup.string().url().optional(),
    apiKey: yup.string().optional(),
    supplierId: yup.string().optional(),
});