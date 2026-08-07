# Ethos Pulse

# PROJETO: PAINEL DE INTELIGÊNCIA ELEITORAL — ETHOS INSTITUCIONAL

Crie uma aplicação web completa e funcional no **Lovable**, voltada para organização, cruzamento, consolidação e visualização de pesquisas eleitorais realizadas em todo o estado de Rondônia.

O sistema pertence à:

**ETHOS INSTITUCIONAL — PESQUISA E COMUNICAÇÃO**

Use as imagens anexadas como referência:

1. Logotipo e identidade visual da Ethos Institucional.

2. Referência visual do painel já elaborado.

O painel deve transmitir precisão, autoridade, segurança e sofisticação institucional. A interface será predominantemente clara. Preto e dourado entram como elementos de identidade, sem transformar todo o sistema em uma interface escura.

---

# 1. OBJETIVO DO SISTEMA

A aplicação deve permitir que a equipe da Ethos:

- Importe pesquisas eleitorais por CSV.

- Integre pesquisas coletadas no KoboToolbox.

- Cadastre várias pesquisas para uma mesma cidade.

- Organize pesquisas por município, período, onda e questionário.

- Escolha quais pesquisas deseja incluir em cada análise.

- Compare pesquisas realizadas em períodos diferentes.

- Consolide pesquisas de vários municípios.

- Analise a evolução dos candidatos conforme a eleição se aproxima.

- Faça cruzamentos demográficos e políticos.

- Selecione um ou vários municípios diretamente no mapa de Rondônia.

- Gere um fechamento geral ponderado da área selecionada.

- Exporte relatórios em diferentes formatos.

- Disponibilize visualização protegida para clientes.

Não crie apenas um protótipo visual. Entregue uma aplicação navegável, com componentes funcionais, estrutura de dados preparada e fluxos reais de uso.

---

# 2. PERFIS DE ACESSO

Implemente autenticação com dois tipos de usuário.

## Administrador

O administrador pode:

- Criar e editar pesquisas.

- Importar arquivos.

- Sincronizar dados do KoboToolbox.

- Cadastrar clientes.

- Definir quais pesquisas cada cliente poderá visualizar.

- Cadastrar questionários.

- Mapear perguntas e respostas.

- Configurar regras de ponderação.

- Criar análises e relatórios.

- Exportar arquivos.

- Criar links protegidos.

- Ver alertas de qualidade dos dados.

- Excluir, arquivar ou substituir pesquisas.

- Consultar logs de alterações.

## Cliente

O cliente possui acesso somente à visualização.

O cliente pode:

- Visualizar os painéis liberados para sua conta.

- Usar filtros autorizados.

- Selecionar municípios no mapa.

- Consultar cruzamentos.

- Navegar entre cenários.

- Visualizar evoluções temporais.

- Exportar relatórios, caso essa permissão esteja habilitada pelo administrador.

O cliente não pode:

- Editar pesquisas.

- Importar CSV.

- Acessar credenciais do KoboToolbox.

- Alterar ponderações.

- Editar questionários.

- Ver dados brutos individuais.

- Excluir ou substituir informações.

Implemente controle de acesso por função e separação segura entre os clientes.

---

# 3. IDENTIDADE VISUAL

## Direção estética

Criar um painel:

- Predominantemente claro.

- Institucional.

- Premium.

- Elegante.

- Organizado.

- Com bastante área em branco.

- Com hierarquia visual muito clara.

- Com aparência de sistema profissional de inteligência de dados.

Não usar aparência de template genérico de dashboard.

## Paleta principal

Utilizar como base:

- Preto profundo: `#0A0A0A`

- Preto secundário: `#151515`

- Dourado institucional: `#C99A19`

- Dourado claro: `#D8B64A`

- Dourado suave para fundos: `#F6ECD0`

- Branco: `#FFFFFF`

- Off-white: `#F8F7F3`

- Cinza de fundo: `#F2F2EF`

- Cinza de borda: `#E3E1DC`

- Texto principal: `#181818`

- Texto secundário: `#66645F`

- Erro: `#C54444`

- Sucesso: `#3C7A57`

- Atenção: `#B47B16`

O dourado deve funcionar como cor de destaque, seleção e ação. Não usar dourado em todos os elementos.

## Tipografia

Usar:

- `Inter` ou `Manrope` para interface, tabelas, gráficos e textos.

- Uma fonte serifada sofisticada, como `Cormorant Garamond`, apenas em detalhes institucionais, títulos especiais ou materiais exportados.

- Não usar fonte serifada em tabelas, filtros ou números.

## Menu lateral

Criar menu lateral fixo em preto, com:

- Logo da Ethos no topo.

- Ícones em traço fino.

- Texto branco.

- Item ativo com fundo dourado.

- Bordas douradas discretas.

- Área inferior com informações resumidas sobre a base selecionada.

O restante da interface deve permanecer claro.

## Cards

Os cards devem ter:

- Fundo branco.

- Bordas cinza muito suaves.

- Sombra leve.

- Cantos entre 10 e 14 pixels.

- Espaçamento interno confortável.

- Títulos em preto.

- Números principais em destaque.

- Ícones dourados.

Evitar excesso de sombras, gradientes e efeitos brilhantes.

---

# 4. FOCO DE DISPOSITIVO

A experiência principal será em computador.

Criar o sistema considerando prioritariamente:

- Monitores de 1366×768.

- Monitores Full HD.

- Notebooks.

- Telas grandes de escritório.

Também criar adaptação básica para tablets e celulares, sem comprometer o desenvolvimento da versão desktop.

No celular:

- O menu lateral vira menu recolhível.

- As tabelas podem ter rolagem horizontal.

- O mapa pode ocupar toda a largura.

- Os cards devem ser empilhados.

---

# 5. ARQUITETURA DE NAVEGAÇÃO

Criar as seguintes páginas:

1. Login

2. Visão Geral

3. Mapa de Rondônia

4. Evolução por Período

5. Cruzamentos

6. Cenários Eleitorais

7. Avaliação de Governos

8. Pautas e Prioridades

9. Central de Pesquisas

10. Questionários

11. Qualidade dos Dados

12. Relatórios e Exportações

13. Clientes e Acessos

14. Configurações

As páginas administrativas devem aparecer somente para usuários administradores.

---

# 6. TELA DE LOGIN

Criar tela predominantemente clara, com painel institucional preto e dourado em uma das laterais.

Elementos:

- Logo da Ethos.

- Título: “Painel de Inteligência Eleitoral”.

- Campo de e-mail.

- Campo de senha.

- Botão “Entrar no painel”.

- Opção “Esqueci minha senha”.

- Mensagem de segurança e confidencialidade.

Microcopy:

> Acesso restrito a usuários autorizados pela Ethos Institucional.

Não criar cadastro público. Os usuários serão criados pelo administrador.

---

# 7. VISÃO GERAL

Criar a página principal seguindo a referência visual anexada.

## Cabeçalho

Exibir:

- Título “Pesquisas Rondônia”.

- Subtítulo “Painel de Inteligência Eleitoral”.

- Nome do usuário.

- Cliente ou organização ativa.

- Data de referência.

- Botão “Limpar filtros”.

- Botão “Exportar”.

- Indicador de última atualização.

## Modos de análise

Criar seletor no topo:

- Pesquisa individual

- Comparar pesquisas

- Consolidar selecionadas

- Última pesquisa de cada cidade

O modo selecionado deve alterar toda a base utilizada nos gráficos.

## Indicadores principais

Exibir cards com:

- Número de entrevistas.

- Quantidade de municípios.

- Período da pesquisa.

- Margem de erro.

- Nível de confiança.

- Universo eleitoral.

- Pesquisas incluídas.

- Data da última sincronização.

## Perfil do eleitor

Exibir:

- Sexo.

- Idade.

- Renda familiar.

- Escolaridade.

- Religião.

- Zona urbana ou rural.

Usar gráficos de barras horizontais, rosca e tabelas compactas.

## Cenário eleitoral principal

Exibir:

- Cargo selecionado.

- Tipo de cenário.

- Intenção de voto.

- Votos totais.

- Votos válidos.

- Branco e nulo.

- Indecisos.

- Número de respostas válidas.

## Evolução

Exibir gráfico de linha com:

- Candidato.

- Período.

- Percentual.

- Variação desde a pesquisa anterior.

- Tendência de alta, estabilidade ou queda.

## Avaliação de governo

Exibir:

- Ótimo.

- Bom.

- Regular positivo.

- Regular negativo.

- Ruim.

- Péssimo.

- Aprova.

- Desaprova.

- Não sabe ou não respondeu.

## Cidades entrevistadas

Exibir distribuição da amostra por município.

---

# 8. CENTRAL DE PESQUISAS

Criar uma área administrativa para organizar todas as pesquisas.

## Tabela principal

Colunas:

- Código da pesquisa.

- Nome da pesquisa.

- Município.

- Estado.

- Período inicial.

- Período final.

- Onda.

- Número de entrevistas.

- Questionário utilizado.

- Versão do questionário.

- Origem dos dados.

- Status.

- Data da importação.

- Responsável.

- Última atualização.

- Ações.

## Status possíveis

- Rascunho.

- Aguardando validação.

- Validada.

- Publicada.

- Arquivada.

- Com erro.

## Filtros

- Município.

- Período.

- Onda.

- Questionário.

- Cliente.

- Status.

- Origem.

- Responsável.

## Ações

- Visualizar.

- Editar.

- Validar.

- Duplicar configuração.

- Substituir arquivo.

- Reprocessar.

- Arquivar.

- Excluir.

- Liberar para clientes.

## Identificação das pesquisas

Cada pesquisa deve possuir um identificador único.

Exemplo:

`RO_PVH_2026_06_01`

Estrutura sugerida:

- Estado.

- Município.

- Ano.

- Mês.

- Número da onda.

Uma mesma cidade pode possuir várias pesquisas.

Exemplo:

- Porto Velho — maio de 2026.

- Porto Velho — junho de 2026.

- Porto Velho — agosto de 2026.

Essas pesquisas nunca devem ser automaticamente misturadas sem uma escolha explícita.

---

# 9. IMPORTAÇÃO MANUAL DE CSV

Criar fluxo de importação em etapas.

## Etapa 1 — Envio

Permitir:

- Arrastar e soltar CSV.

- Selecionar arquivo no computador.

- Informar codificação e separador quando necessário.

## Etapa 2 — Informações da pesquisa

Solicitar:

- Nome.

- Código.

- Município.

- Código IBGE.

- Período de realização.

- Onda.

- Universo eleitoral.

- Número de entrevistas.

- Margem de erro.

- Nível de confiança.

- Questionário utilizado.

- Versão do questionário.

- Cliente relacionado.

- Observações metodológicas.

## Etapa 3 — Pré-visualização

Mostrar:

- Primeiras linhas.

- Quantidade de registros.

- Quantidade de colunas.

- Colunas vazias.

- Valores inesperados.

- Possíveis duplicidades.

- Problemas de codificação.

## Etapa 4 — Mapeamento

Permitir associar cada coluna do CSV a:

- Identificador da entrevista.

- Data da entrevista.

- Município.

- Latitude.

- Longitude.

- Peso.

- Perguntas do questionário.

- Informações demográficas.

- Perguntas extras.

O administrador deve conseguir:

- Reutilizar um mapeamento anterior.

- Salvar um modelo de importação.

- Criar uma pergunta nova durante o mapeamento.

- Ignorar colunas desnecessárias.

- Definir valores equivalentes.

Exemplo:

- “Masculino”, “M”, “Homem” → Masculino.

- “Não respondeu”, “NR”, “NS/NR” → Não sabe/Não respondeu.

## Etapa 5 — Validação

Mostrar:

- Registros válidos.

- Registros com alerta.

- Registros bloqueados.

- Perguntas sem correspondência.

- Respostas fora do padrão.

- Cidades ausentes.

- Datas inválidas.

- Entrevistas duplicadas.

## Etapa 6 — Confirmação

Exibir resumo completo antes da publicação.

Botões:

- Salvar como rascunho.

- Importar e validar.

- Cancelar importação.

---

# 10. INTEGRAÇÃO COM KOBOTOOLBOX

Criar uma área de configuração para integração com KoboToolbox.

Campos:

- URL do servidor.

- Token ou chave de API.

- ID do projeto.

- ID do formulário.

- Nome da integração.

- Cliente relacionado.

- Frequência de atualização.

- Data da última sincronização.

- Status da conexão.

Funções:

- Testar conexão.

- Buscar formulários disponíveis.

- Selecionar formulário.

- Visualizar estrutura das perguntas.

- Mapear campos do Kobo para o questionário interno.

- Sincronizar agora.

- Importar apenas novas entrevistas.

- Reprocessar todas as entrevistas.

- Consultar histórico de sincronizações.

Criar prevenção contra duplicidades usando:

- ID original da submissão.

- ID da entrevista.

- Data e hora.

- Identificador da pesquisa.

A integração deve permitir atualização manual dentro do painel.

Deixar a arquitetura preparada para sincronizações automáticas futuras, mesmo que inicialmente o botão principal seja “Sincronizar agora”.

Nunca exibir tokens completos após serem salvos.

---

# 11. GESTÃO DE QUESTIONÁRIOS

Criar uma biblioteca de questionários.

O sistema terá um questionário-base, mas diferentes cidades e períodos poderão possuir perguntas extras ou alterações.

## Cadastro do questionário

Campos:

- Nome.

- Código.

- Versão.

- Data de criação.

- Data de vigência.

- Cliente.

- Descrição.

- Status.

- Arquivo original anexado.

- Responsável.

Permitir envio de:

- PDF.

- DOCX.

- XLSX.

- CSV.

- JSON.

O sistema não precisa interpretar perfeitamente todos esses formatos de forma automática. Deve permitir que o administrador utilize o arquivo como referência e faça o mapeamento das perguntas.

## Cadastro das perguntas

Cada pergunta deve possuir:

- Código fixo.

- Texto completo.

- Texto resumido.

- Categoria.

- Tipo.

- Ordem.

- Opções de resposta.

- Possibilidade de múltipla resposta.

- Campo obrigatório ou opcional.

- Aplicação geográfica.

- Data de vigência.

- Versão.

- Compatibilidade com pesquisas anteriores.

## Tipos de pergunta

- Escolha única.

- Múltipla escolha.

- Resposta aberta.

- Número.

- Escala.

- Avaliação.

- Ranking.

- Data.

- Localização.

- Intenção de voto espontânea.

- Intenção de voto estimulada.

- Rejeição.

- Potencial eleitoral.

- Aprovação.

- Cenário de confronto.

## Perguntas-base de perfil

Criar códigos consistentes para:

- Sexo.

- Idade.

- Renda familiar.

- Escolaridade.

- Religião.

- Zona urbana ou rural.

- Posicionamento político.

- Município.

- Região.

- Período.

## Compatibilidade

Quando uma pergunta mudar entre questionários, permitir:

- Considerar as versões equivalentes.

- Manter as versões separadas.

- Criar uma equivalência parcial.

- Bloquear comparações incompatíveis.

Exibir alertas quando o usuário tentar comparar perguntas ou cenários que sofreram alterações relevantes.

---

# 12. EXPLORADOR DE CRUZAMENTOS

Criar uma página específica chamada “Cruzamentos”.

## Seleção principal

O usuário escolhe:

- Pesquisa ou conjunto de pesquisas.

- Pergunta principal.

- Variável de cruzamento.

- Filtros.

- Forma de cálculo.

- Exibição por percentual ou número absoluto.

## Variáveis disponíveis

Permitir cruzar os resultados por:

- Sexo.

- Idade.

- Renda familiar.

- Escolaridade.

- Religião.

- Região.

- Município.

- Zona urbana ou rural.

- Período.

- Posicionamento político.

Não incluir outros cruzamentos automaticamente.

## Formas de visualização

- Tabela cruzada.

- Barras horizontais.

- Barras agrupadas.

- Barras empilhadas.

- Mapa de calor.

- Gráfico de linha para períodos.

- Cards comparativos.

## Tabela cruzada

Mostrar:

- Percentual.

- Número absoluto.

- Base de respondentes.

- Total por coluna.

- Total por linha.

- Diferença para o total geral.

- Indicador visual de maior e menor resultado.

Criar botão:

- Trocar linhas e colunas.

- Mostrar percentuais por linha.

- Mostrar percentuais por coluna.

- Mostrar números absolutos.

- Ocultar categorias sem resposta.

- Exportar tabela.

## Cruzamento duplo

Permitir análises como:

- Intenção de voto × sexo × idade.

- Avaliação do governador × região × período.

- Rejeição × renda × religião.

Usar filtros progressivos para não deixar a interface confusa.

## Bases pequenas

Exibir alerta quando a quantidade de entrevistas em um segmento for pequena.

Texto sugerido:

> Atenção: este resultado possui uma base reduzida e deve ser interpretado com cautela.

O limite deve ser configurável pelo administrador. Usar 30 entrevistas como valor inicial de alerta, sem tratar esse número como regra metodológica definitiva.

---

# 13. EVOLUÇÃO POR PERÍODO

Criar página focada em acompanhamento temporal.

Filtros:

- Cargo.

- Cenário.

- Candidato.

- Município.

- Região.

- Pesquisa.

- Data inicial.

- Data final.

- Perfil do eleitor.

## Indicadores

Mostrar:

- Resultado atual.

- Resultado anterior.

- Variação em pontos percentuais.

- Maior resultado no período.

- Menor resultado no período.

- Rejeição atual.

- Conhecimento atual.

- Percentual de indecisos.

## Gráfico de linha

Permitir selecionar vários candidatos.

Cada ponto deve mostrar:

- Pesquisa.

- Período.

- Percentual.

- Número de entrevistas.

- Município ou área.

- Cenário utilizado.

Quando o cenário eleitoral mudar, marcar visualmente a mudança.

Exibir aviso:

> A composição deste cenário foi alterada entre as pesquisas selecionadas. A comparação deve considerar essa diferença.

Permitir comparar:

- Intenção estimulada.

- Intenção espontânea.

- Rejeição.

- Potencial eleitoral.

- Aprovação.

- Avaliação de governo.

- Branco e nulo.

- Indecisos.

---

# 14. MAPA INTERATIVO DE RONDÔNIA

Criar mapa municipal real de Rondônia utilizando limites geográficos corretos em GeoJSON.

Não desenhar formas aproximadas.

## Interação

Permitir:

- Clicar em um município para selecionar.

- Clicar novamente para remover.

- Selecionar vários municípios.

- Pesquisar município por nome.

- Selecionar todos.

- Limpar seleção.

- Visualizar lista dos municípios selecionados.

- Exibir quantidade de entrevistas disponíveis em cada município.

O mapa deve usar:

- Dourado claro para municípios com dados.

- Cinza claro para municípios sem dados.

- Dourado escuro ou preto para municípios selecionados.

- Borda branca fina entre os municípios.

## Painel lateral do mapa

Exibir:

- Quantidade de municípios selecionados.

- Lista dos municípios.

- Número de pesquisas disponíveis.

- Número de entrevistas.

- Período abrangido.

- Regra de ponderação ativa.

Botão principal:

**GERAR FECHAMENTO DA ÁREA**

Ao clicar, recalcular todos os gráficos considerando somente os municípios selecionados.

## Tooltip

Ao passar o mouse em um município, mostrar:

- Nome.

- Região.

- População eleitoral.

- Número de pesquisas.

- Última pesquisa.

- Número de entrevistas disponíveis.

---

# 15. MODOS DE CONSOLIDAÇÃO

O sistema deve oferecer todas estas opções:

## Pesquisa individual

Analisa somente uma pesquisa selecionada.

## Comparar pesquisas

Exibe pesquisas separadamente.

## Consolidar pesquisas selecionadas

O administrador ou usuário autorizado escolhe quais pesquisas entram no cálculo.

## Última pesquisa de cada cidade

Seleciona automaticamente a pesquisa mais recente disponível em cada município.

## Consolidar todas

Inclui todas as pesquisas que atendem aos filtros.

Antes de gerar qualquer consolidação, exibir claramente:

- Pesquisas incluídas.

- Municípios incluídos.

- Período total.

- Total de entrevistas.

- Regra de ponderação.

- Questionários e versões.

- Cenários considerados.

Nunca misturar pesquisas silenciosamente.

---

# 16. REGRAS DE PONDERAÇÃO

Permitir três formas de ponderação.

## Peso vindo do CSV

Usar uma coluna de peso já existente na base.

## Peso calculado pelo sistema

Calcular o peso do município usando o universo eleitoral cadastrado.

Estrutura conceitual:

`peso final = peso individual × peso geográfico`

O método completo deve ser configurável e validado pela equipe técnica da Ethos.

## Peso manual

Permitir que o administrador informe o peso de cada:

- Pesquisa.

- Município.

- Região.

- Onda.

## Tela de configuração

Mostrar:

- Método selecionado.

- Pesos utilizados.

- Soma dos pesos.

- Distribuição antes da ponderação.

- Distribuição depois da ponderação.

- Impacto nos resultados.

- Alertas de inconsistência.

Criar opção de salvar modelos de ponderação.

Exemplo:

- Fechamento estadual padrão.

- Interior de Rondônia.

- Região Central.

- Cliente específico.

- Pesquisa sem ponderação.

---

# 17. REGRAS DE CÁLCULO

Aplicar cálculos consistentes.

## Percentuais

Permitir configurar o denominador:

- Total de entrevistas.

- Total de respostas válidas.

- Total ponderado.

- Base filtrada.

## Votos válidos

Excluir, conforme configuração:

- Branco.

- Nulo.

- Indeciso.

- Não sabe.

- Não respondeu.

Mostrar sempre quais categorias foram excluídas.

## Perguntas de múltipla escolha

Exibir aviso:

> Pergunta de múltipla resposta. A soma dos percentuais pode ultrapassar 100%.

## Comparações

Não somar percentuais de cidades diretamente.

Usar os registros individuais e os pesos definidos.

## Margem de erro

Não calcular automaticamente uma nova margem para cada pequeno segmento sem uma regra estatística explicitamente configurada.

Mostrar:

- Margem da pesquisa original.

- Base do segmento.

- Aviso sobre recortes pequenos.

---

# 18. CENÁRIOS ELEITORAIS

Criar página para:

- Presidente.

- Governador.

- Senador.

- Deputado federal.

- Deputado estadual.

- Prefeito, quando houver pesquisas municipais.

Tipos de análise:

- Espontânea.

- Estimulada.

- Rejeição.

- Votos válidos.

- Confronto direto.

- Cenários com vice.

- Potencial eleitoral.

- Avaliação de apoios.

## Cadastro de candidatos

Cada candidato deve possuir:

- ID fixo.

- Nome completo.

- Nome de urna.

- Partido.

- Cargo.

- Foto.

- Cor de identificação.

- Status.

- Período de participação.

- Observações.

Alterações de partido ou nome exibido não devem criar automaticamente um novo candidato.

---

# 19. AVALIAÇÃO DE GOVERNOS

Criar painéis para:

- Presidente.

- Governador.

- Prefeitos.

Visualizações:

- Avaliação detalhada.

- Aprovação e desaprovação.

- Comparação entre períodos.

- Comparação por município.

- Comparação por região.

- Cruzamentos demográficos.

- Mapa por aprovação.

- Ranking municipal.

Categorias:

- Ótimo.

- Bom.

- Regular positivo.

- Regular negativo.

- Ruim.

- Péssimo.

- Não sabe ou não respondeu.

---

# 20. PAUTAS, PRIORIDADES E DORES

Criar página para:

- Avaliação de pautas políticas.

- Prioridades para o próximo governo.

- Principais problemas locais.

- Opinião favorável ou contrária.

- Ranking de prioridades.

Permitir filtros por:

- Município.

- Região.

- Período.

- Sexo.

- Idade.

- Renda.

- Escolaridade.

- Religião.

- Posicionamento político.

Para múltiplas escolhas, apresentar corretamente a informação de que os percentuais podem ultrapassar 100%.

---

# 21. QUALIDADE DOS DADOS

Criar painel interno com alertas.

Verificar:

- Arquivos duplicados.

- Entrevistas duplicadas.

- IDs repetidos.

- Municípios inválidos.

- Código IBGE ausente.

- Datas fora do período.

- Pesquisas sem peso.

- Perguntas não mapeadas.

- Opções de resposta inesperadas.

- Campos obrigatórios vazios.

- Inconsistência entre amostra declarada e registros importados.

- Coordenadas fora de Rondônia.

- Diferenças entre questionários.

- Candidatos duplicados.

- Respostas fora do domínio permitido.

Classificar alertas:

- Crítico.

- Alto.

- Médio.

- Informativo.

Permitir:

- Corrigir.

- Ignorar com justificativa.

- Reprocessar.

- Baixar relatório de erros.

- Marcar como resolvido.

---

# 22. RELATÓRIOS E EXPORTAÇÕES

Permitir exportar:

- PDF completo.

- PDF somente da página atual.

- PNG de cada gráfico.

- Excel com tabelas cruzadas.

- CSV com dados filtrados.

- PowerPoint.

- Link protegido para clientes.

## PDF

O PDF deve seguir a identidade da Ethos:

- Capa institucional.

- Logo.

- Título.

- Cliente.

- Período.

- Área analisada.

- Metodologia.

- Gráficos.

- Tabelas.

- Rodapé de confidencialidade.

- Data de geração.

- Código do relatório.

## PowerPoint

Criar estrutura com:

- Capa.

- Metodologia.

- Perfil da amostra.

- Cenários.

- Cruzamentos.

- Evolução.

- Mapa.

- Avaliações.

- Prioridades.

- Conclusões descritivas.

Não gerar interpretações políticas automáticas como fatos. Quando houver texto automático, usar linguagem descritiva e neutra.

## Link protegido

Permitir:

- Criar senha.

- Definir data de expiração.

- Definir cliente.

- Limitar páginas visíveis.

- Bloquear download.

- Revogar acesso.

---

# 23. BASE UTILIZADA NESTE RESULTADO

Manter um card fixo no menu lateral ou em área de fácil acesso.

Título:

**BASE UTILIZADA NESTE RESULTADO**

Mostrar:

- Pesquisas incluídas.

- Municípios incluídos.

- Período.

- Entrevistas.

- Universo.

- Margem de erro.

- Nível de confiança.

- Regra de ponderação.

- Questionário.

- Última atualização.

Botão:

**VER DETALHES DA BASE**

Ao abrir, mostrar uma janela com todas as pesquisas incluídas e as regras aplicadas.

---

# 24. BANCO DE DADOS

O banco ainda não foi definido.

Portanto:

- Não acoplar toda a aplicação diretamente a um fornecedor específico.

- Criar uma camada de serviços e repositórios.

- Deixar a estrutura preparada para PostgreSQL ou Supabase.

- Usar dados simulados apenas na primeira visualização.

- Separar claramente frontend, autenticação, armazenamento de arquivos e dados analíticos.

- Criar tipos TypeScript para todas as entidades.

- Preparar documentação das tabelas necessárias.

Estrutura sugerida:

- `users`

- `roles`

- `clients`

- `client_users`

- `surveys`

- `survey_waves`

- `survey_files`

- `questionnaires`

- `questionnaire_versions`

- `questions`

- `question_options`

- `respondents`

- `responses`

- `municipalities`

- `regions`

- `candidates`

- `electoral_scenarios`

- `scenario_candidates`

- `weighting_models`

- `weighting_rules`

- `imports`

- `import_mappings`

- `kobo_integrations`

- `sync_logs`

- `reports`

- `shared_links`

- `audit_logs`

Armazenar respostas preferencialmente em formato normalizado, permitindo perguntas extras sem alterar toda a estrutura do banco.

Preservar também o arquivo original importado para auditoria.

---

# 25. SEGURANÇA E CONFIDENCIALIDADE

Implementar:

- Controle de acesso por função.

- Separação entre clientes.

- Proteção de rotas.

- Logs de acesso.

- Logs de alteração.

- URLs assinadas para arquivos.

- Tokens protegidos.

- Sessões seguras.

- Recuperação de senha.

- Expiração de links compartilhados.

- Bloqueio de dados individuais para clientes.

- Mascaramento de informações sensíveis.

- Auditoria de importações.

Inserir no rodapé:

> Pesquisa realizada para consumo interno. Proibida a divulgação e/ou compartilhamento sem autorização da Ethos Institucional.

Permitir que o administrador altere esse texto por relatório.

---

# 26. MICROINTERAÇÕES

Adicionar microinterações discretas:

- Skeleton loading durante carregamento.

- Animação suave ao trocar filtros.

- Destaque ao selecionar município.

- Confirmação antes de excluir.

- Toast de sucesso ou erro.

- Barra de progresso durante importação.

- Indicador de sincronização com Kobo.

- Tooltip explicativo em termos técnicos.

- Estado vazio bem desenhado.

- Mensagens de validação claras.

- Transições entre 150 e 250 milissegundos.

Não usar animações chamativas.

---

# 27. MICROCOPY

Usar linguagem profissional, clara e brasileira.

Exemplos:

## Sem pesquisas

> Nenhuma pesquisa corresponde aos filtros selecionados.

## Sem dados no município

> Ainda não existem entrevistas disponíveis para este município no período selecionado.

## Consolidação

> Revise as pesquisas e a regra de ponderação antes de gerar o fechamento.

## Importação concluída

> A base foi importada. Verifique os alertas antes de publicá-la.

## Erro de mapeamento

> Algumas colunas ainda não foram associadas a perguntas do questionário.

## Cenários diferentes

> Os cenários selecionados possuem composições diferentes. Analise a comparação com cautela.

## Kobo sincronizado

> Sincronização concluída. Novas entrevistas foram adicionadas à pesquisa.

---

# 28. COMPONENTES REUTILIZÁVEIS

Criar componentes reutilizáveis para:

- Barra de filtros.

- Card de indicador.

- Gráfico eleitoral.

- Gráfico de evolução.

- Tabela cruzada.

- Mapa municipal.

- Seletor de pesquisa.

- Seletor de período.

- Seletor de cenário.

- Seletor de ponderação.

- Lista de municípios.

- Card metodológico.

- Alerta de base pequena.

- Modal de exportação.

- Assistente de importação.

- Visualizador de questionário.

- Painel de qualidade.

- Menu de ações da pesquisa.

---

# 29. DADOS DEMONSTRATIVOS

Na primeira versão, utilizar dados fictícios claramente identificados como demonstração.

Criar exemplos para:

- Porto Velho.

- Ji-Paraná.

- Ariquemes.

- Cacoal.

- Vilhena.

- Jaru.

- Rolim de Moura.

- Ouro Preto do Oeste.

Criar pelo menos três períodos fictícios para demonstrar a evolução temporal.

Não apresentar esses dados como resultados reais.

Adicionar selo:

**DADOS DE DEMONSTRAÇÃO**

---

# 30. REQUISITOS DE UX

A aplicação deve:

- Mostrar sempre qual base está sendo analisada.

- Evitar filtros escondidos.

- Preservar os filtros ao navegar entre páginas.

- Permitir limpar todos os filtros.

- Mostrar número absoluto junto aos percentuais quando solicitado.

- Exibir base amostral em tooltips.

- Evitar gráficos de pizza com muitas categorias.

- Usar barras horizontais para listas longas.

- Usar linhas para evolução temporal.

- Usar mapa de calor para tabelas extensas.

- Usar cores consistentes para o mesmo candidato.

- Não usar uma cor diferente aleatória para cada resposta.

- Não apresentar médias simples entre municípios como consolidado.

- Não esconder branco, nulo ou indecisos.

- Não misturar ondas sem informar.

- Não misturar questionários incompatíveis.

---

# 31. CRITÉRIOS DE ACEITAÇÃO

A primeira versão será considerada válida quando permitir:

1. Login de administrador e cliente.

2. Navegação completa entre as páginas.

3. Importação manual de um CSV.

4. Pré-visualização e mapeamento de colunas.

5. Cadastro de uma pesquisa.

6. Cadastro de várias pesquisas para a mesma cidade.

7. Seleção de pesquisa individual.

8. Comparação entre pesquisas.

9. Consolidação de pesquisas selecionadas.

10. Seleção da pesquisa mais recente por município.

11. Configuração das três formas de ponderação.

12. Seleção de vários municípios no mapa.

13. Geração do fechamento da área.

14. Cruzamento por todas as variáveis definidas.

15. Gráfico de evolução temporal.

16. Controle de permissões entre administrador e cliente.

17. Exportação inicial em PDF, CSV e imagem.

18. Estrutura preparada para KoboToolbox.

19. Painel de qualidade dos dados.

20. Identidade visual fiel à Ethos.

---

# 32. REGRAS FINAIS DE DESIGN

- Manter o painel predominantemente claro.

- Usar preto principalmente no menu lateral e em textos.

- Usar dourado em ações, ícones, seleções e destaques.

- Não criar fundos dourados extensos.

- Não usar visual excessivamente escuro.

- Não alterar o logotipo.

- Não usar efeitos metálicos exagerados.

- Não usar gráficos multicoloridos sem necessidade.

- Não criar uma interface genérica de sistema financeiro.

- Manter aparência institucional, política e analítica.

- Priorizar legibilidade, confiança e precisão.

- Usar o layout da referência como ponto de partida, refinando proporções, tipografia, espaçamento e hierarquia.

Crie primeiro a estrutura global da aplicação, o sistema visual, as rotas, os componentes reutilizáveis e os dados demonstrativos. Depois implemente os fluxos administrativos e as integrações, mantendo o código modular e preparado para evolução.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ethos-data-insight.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a0d77f91-e48b-46f8-913f-11afb6a27630).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
