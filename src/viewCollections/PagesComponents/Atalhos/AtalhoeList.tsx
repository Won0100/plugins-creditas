import * as MUI from "@mui/material";
import * as MUIIcon from "@mui/icons-material";

export const AtalhoList = ({ documents, onEdit, onDelete, isLoading, departments }: { documents: any[], onEdit: (template: any) => void, onDelete: (template: any) => void, isLoading: boolean, departments: any[] }) => {
    return (
        <MUI.Table sx={{ width: '100%' }}>
            <MUI.TableHead>
                <MUI.TableRow sx={{ backgroundColor: 'transparent' }}>
                    <MUI.TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Nome</MUI.TableCell>
                    <MUI.TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Permissões</MUI.TableCell>
                    <MUI.TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Criado em</MUI.TableCell>
                    <MUI.TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Atualizado em</MUI.TableCell>
                    <MUI.TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Ações</MUI.TableCell>
                </MUI.TableRow>
            </MUI.TableHead>
            <MUI.TableBody>
                {documents.length > 0 ? documents.map((document) => (
                    <MUI.TableRow
                        key={document.id}
                        sx={{
                            backgroundColor: 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                transition: 'background-color 0.2s ease'
                            }
                        }}
                    >
                        <MUI.TableCell>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column'
                            }}>
                                <p>{document.name}</p>
                                <p style={{ fontSize: '0.8rem', color: 'gray' }}>{document.id}</p>
                            </div>
                        </MUI.TableCell>
                        <MUI.TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={document.teams?.length > 0 ? document.teams.join(', ') : 'Todas as equipes'}>
                            {document.departments?.length > 0 
                                ? departments.filter((department) => document.departments.includes(department.id)).map((department) => department.label).join(', ')
                                : 'Todas as áreas'}
                        </MUI.TableCell>
                        <MUI.TableCell>
                            {document.createdAt && new Date(document.createdAt).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </MUI.TableCell>
                        <MUI.TableCell>
                            {document.updatedAt && new Date(document.updatedAt).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </MUI.TableCell>
                        <MUI.TableCell>
                            <MUI.IconButton
                                onClick={() => onEdit(document)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'primary.light'
                                    }
                                }}
                            >
                                <MUIIcon.Edit />
                            </MUI.IconButton>
                            <MUI.IconButton
                                onClick={() => onDelete(document)}
                            >
                                <MUIIcon.Delete />
                            </MUI.IconButton>
                        </MUI.TableCell>
                    </MUI.TableRow>
                )) : (
                    <MUI.TableRow>
                        <MUI.TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                            {isLoading ? 'Carregando...' : 'Nenhum atalho encontrado'}
                        </MUI.TableCell>
                    </MUI.TableRow>
                )}
            </MUI.TableBody>
        </MUI.Table>
    );
}; 