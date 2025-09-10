import { useEffect, useState } from "react";
import * as MUI from "@mui/material";
import * as MUIIcon from "@mui/icons-material";
import { CustomButton } from "../../../components/Custom/CustomButton";
import { PageLayout } from "../../../components/PageLayout";

import { AtalhoList } from "./AtalhoeList";
import { AtalhoForm } from "./AtalhoForm";

import { atalhosDocument } from "../../../services/sync/atalhos";
import { useSnackbar } from "hooks/useSnackbar";
import { AtalhoFilter } from "./AtalhoFilter";
import { AtalhoFormData } from "types/atalhos";

import { departmentDocument } from "services/sync/department";


export default function Templates() {
  const { throwAlert } = useSnackbar();

  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  const [openDialog, setOpenDialog] = useState(false);

  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(false)

  const [nameFilter, setNameFilter] = useState("");
  const [departmentsFilter, setDepartmentsFilter] = useState<string[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]);
  
  const [departments, setDepartments] = useState<any[]>([]);
  
  useEffect(() => {
    getDocuments();
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents]);

  const getDocuments = async () => {
    setLoading(true);
    try {
      const response = await atalhosDocument.get();
      setDocuments(response);
    } catch (error) {
      throwAlert('error', 'Erro ao carregar atalhos');
    } finally {
      setLoading(false);
    }
  }

  const fetchDepartments = async () => {
    const response = await departmentDocument.get();
    if (response) {
      const departmentsList = response.departments.map((department: any) => ({
        value: department.name,
        id: department.id,
        label: department.name
      }));

      setDepartments(departmentsList);
    }
  }

  const filterDocuments = () => {
    let filtered = [...documents];

    if (nameFilter) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (departmentsFilter.length > 0) {
      filtered = filtered.filter(doc => {
        if (!doc.departments || doc.departments.length === 0) return false;
        
        // Converter IDs das equipes para nomes antes de comparar
        const departmentNames = doc.departments.map((departmentId: string) => {
          const department = departments.find(t => t.id === departmentId);
          return department ? department.label : departmentId;
        });
        
        return departmentNames.some((departmentName: string) => departmentsFilter.includes(departmentName));
      });
    }

    setFilteredDocuments(filtered);
  };

  const handleFilter = () => {
    filterDocuments();
  };

  const handleCreate = () => {
    setSelectedDocument(null);
    setOpenDialog(true);
  };

  const handleEdit = (document: any) => {
    setSelectedDocument(document);
    setOpenDialog(true);
  };

  const handleDelete = async (document: AtalhoFormData) => {
    try {
      if (!document.id) {
        throw new Error('ID do atalho não encontrado');
      }

      const response = await atalhosDocument.delete(document.id);
      if (response.success) {
        throwAlert('success', response.message);
        await getDocuments();
      } else {
        throwAlert('error', response.message);
      }
    } catch (error) {
      throwAlert('error', 'Erro ao excluir atalho');
    }
  };

  const handleSave = async (payload: AtalhoFormData) => {
    let response: any;
    setLoadingSave(true);
    try {

      // Substituir nomes das equipes pelos IDs correspondentes
      const payloadWithTeamIds = {
        ...payload,
        departments: payload.departments.map((departmentName: string) => {
          const department = departments.find(t => {
            return t.label === departmentName
          });
          return department ? department.id : departmentName;
        })
      };

      switch (payload.action) {
        case 'create':
          response = await atalhosDocument.create(payloadWithTeamIds);
          break;
        case 'update':
          response = await atalhosDocument.update(payloadWithTeamIds);
          break;
      }

      if (response.success) {
        throwAlert('success', response.message);
      } else {
        throwAlert('error', response.message);
      }

      await getDocuments();
      handleClose();
    } catch (error) {
      throwAlert('error', `Erro ao ${payload.action === 'create' ? 'criar' : 'atualizar'} atalho`);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedDocument(null);
  };

  return (
    <PageLayout
      title="Atalhos"
      description="Aqui você pode criar novos atalhos e editar as permissões de acesso dos atalhos existentes."
      ButtonsActions={
        <CustomButton
          value="Novo Atalho"
          onClick={handleCreate}
          Icon={MUIIcon.Add}
        />
      }
    >
      <AtalhoFilter
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        departmentsFilter={departmentsFilter}
        setDepartmentsFilter={setDepartmentsFilter}
        departments={departments}
        onFilter={handleFilter}
      />
      <MUI.Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <MUI.DialogTitle>
          {selectedDocument ? "Editar Atalho" : "Novo Atalho"}
        </MUI.DialogTitle>

        <MUI.DialogContent sx={{ maxWidth: 'lg', marginTop: '20px' }}>
          <AtalhoForm
            template={selectedDocument}
            onSave={(payload: AtalhoFormData) => handleSave(payload)}
            onCancel={handleClose}
            departments={departments}
          />
        </MUI.DialogContent>
      </MUI.Dialog>

      <MUI.Paper sx={{ p: 3, marginTop: '20px' }}>
        <AtalhoList
          isLoading={loading || loadingSave}
          documents={filteredDocuments}
          onEdit={handleEdit}
          onDelete={handleDelete}
          departments={departments}
        />
      </MUI.Paper>
    </PageLayout>
  );
}