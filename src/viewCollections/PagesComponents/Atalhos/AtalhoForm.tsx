import * as MUI from "@mui/material";
import * as MUIIcon from "@mui/icons-material";
import { useState } from "react";
import { CustomInput } from "../../../components/Custom/CustomInput";
import { CustomTextarea } from "../../../components/Custom/CustomTextarea";
import { CustomButton } from "../../../components/Custom/CustomButton";
import { CustomMultiSelect } from "../../../components/Custom/CustomMultiSelect";
import { useSnackbar } from "hooks/useSnackbar";
import { AtalhoFormData } from "types/atalhos";

type Props = {
    template: AtalhoFormData | null;
    onSave: (template: AtalhoFormData) => void;
    onCancel: () => void;
    departments: any[];
}

export function AtalhoForm({ template, onSave, onCancel, departments }: Props) {
    const { throwAlert } = useSnackbar();
    const [formData, setFormData] = useState<AtalhoFormData>(() => {
        return {
            name: template?.name || "",
            departments: departments.filter((department) => template?.departments.includes(department.id)).map((department) => department.label) || [],
            content: template?.content || "",
            id: template?.id || "",
            action: template ? "update" : "create"
        };
    });

    const [loadingSave, setLoadingSave] = useState(false);

    const handleChange = (field: keyof any, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSaveClick = async () => {
        if (!template) {
            if (!formData.name || !formData.content) {
                throwAlert('error', 'Preencha todos os campos obrigatórios');
                return;
            }
        }

        setLoadingSave(true);
        await onSave(formData);
        setLoadingSave(false);
    };

    return (
        <MUI.Box>
            <MUI.Grid container spacing={2} mt={1}>
                <MUI.Grid item xs={24} md={8}>
                    <CustomInput
                        type="text"
                        label="Nome do Template"
                        placeholder="Digite o nome"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        Icon={MUIIcon.Title}
                        required
                        width="100%"
                    />
                </MUI.Grid>

                <MUI.Grid item xs={12} md={4}>
                    <CustomMultiSelect
                        label="Áreas com Acesso"
                        placeholder="Selecione as áreas"
                        value={formData.departments}
                        setValue={(value) => handleChange("departments", value)}
                        options={departments}
                        Icon={MUIIcon.Groups}
                        width="100%"
                    />
                </MUI.Grid>

                <MUI.Grid item xs={12}>
                    <CustomTextarea
                        placeholder="Digite o conteúdo"
                        label="Conteúdo do Template"
                        value={formData.content}
                        setValue={(e) => handleChange("content", e.target.value)}
                        required
                        width="100%"
                    />
                </MUI.Grid>

                <MUI.Grid item xs={12}>
                    <MUI.Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <CustomButton
                            value="Cancelar"
                            onClick={onCancel}
                            Icon={MUIIcon.Close}
                            color="inherit"
                            width="auto"
                            disabled={loadingSave}
                        />
                        <CustomButton
                            value={template ? "Salvar Alterações" : "Criar Template"}
                            onClick={handleSaveClick}
                            Icon={template ? MUIIcon.Save : MUIIcon.Add}
                            width="auto"
                            disabled={loadingSave}
                        />
                    </MUI.Box>
                </MUI.Grid>
            </MUI.Grid>
        </MUI.Box>
    );
}
