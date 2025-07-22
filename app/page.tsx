"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, TrendingUp, Compass, Menu, MapPin, Phone, Globe, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useTransactions } from "@/hooks/use-transactions"

interface Project {
  id: string
  title: string
  description: string
  image: string
  meta: number
  arrecadado: number
}

interface SupportData {
  nomeApoiador: string
  esferaGovernamental: string
  siglaSecretaria: string
  valorContribuicao: number
}

export default function CuritibaProjects() {
  const { isAuthenticated, isAdmin } = useAuth()
  const { addTransaction } = useTransactions()

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "cras-caximba",
      title: "Implantação do CRAS Caximba",
      description: "Centro de Referência da Assistência Social voltado ao atendimento da população em situação de...",
      image: "/Implementação CRAS Caximba/Implementação do CRAS Caximba.jpeg",
      meta: 3600000,
      arrecadado: 0,
    },
    {
      id: "jornada-digital",
      title: "SMS - JORNADA DIGITAL",
      description: "Modernização dos serviços de saúde através de tecnologia digital para melhor atendimento.",
      image: "/SMDC/Projetos.jpeg",
      meta: 3000000,
      arrecadado: 0,
    },
    {
      id: "escola-circo",
      title: "Escola de Circo e Marionetes",
      description: "Projeto cultural para formação artística e desenvolvimento de talentos locais.",
      image: "/E C M/Escola de circo.jpeg",
      meta: 2500000,
      arrecadado: 0,
    },
    {
      id: "secretaria-mulher",
      title: "Secretaria Municipal da Mulher e Igualdade Étnico-Racial",
      description: "Projetos de empoderamento feminino e promoção da igualdade racial.",
      image: "/Mulher R/Mulher.jpeg",
      meta: 1800000,
      arrecadado: 0,
    },
    {
      id: "app-mulheres",
      title: "Aplicativo Mulheres",
      description: "Plataforma digital para apoio e proteção às mulheres da cidade.",
      image: "/APP MULHER/App mulher.jpeg",
      meta: 800000,
      arrecadado: 0,
    },
    {
      id: "meio-ambiente",
      title: "Secretaria Municipal do Meio Ambiente",
      description: "Projetos de sustentabilidade e preservação ambiental urbana.",
      image: "/AMBIENTE/ambiente.jpeg",
      meta: 4200000,
      arrecadado: 0,
    },
    {
      id: "museu-historia",
      title: "Novo Museu de História Natural de Curitiba",
      description: "Construção de moderno espaço cultural e educativo para a cidade.",
      image: "/Museu/Museu.jpeg",
      meta: 15000000,
      arrecadado: 0,
    },
    {
      id: "hospital-bairro-novo",
      title: "Construção do novo Hospital do Bairro Novo",
      description: "Nova unidade hospitalar para atender a região com excelência.",
      image: "/Hospital/hospital.jpeg",
      meta: 25000000,
      arrecadado: 0,
    },
  ])

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [supportData, setSupportData] = useState<SupportData>({
    nomeApoiador: "",
    esferaGovernamental: "",
    siglaSecretaria: "",
    valorContribuicao: 0,
  })
  const [removeData, setRemoveData] = useState({
    valorRemocao: 0,
    motivo: "",
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedProjectImages, setSelectedProjectImages] = useState<string | null>(null)
  const [selectedSecretaria, setSelectedSecretaria] = useState<string | null>(null)
  const [showAdminLoginPrompt, setShowAdminLoginPrompt] = useState(false)

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem("curitiba-projects")
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects)
        setProjects(parsedProjects)
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error)
      }
    }
  }, [])

  // Salvar dados no localStorage sempre que projects mudar
  useEffect(() => {
    localStorage.setItem("curitiba-projects", JSON.stringify(projects))
  }, [projects])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const calculateProgress = (arrecadado: number, meta: number) => {
    return (arrecadado / meta) * 100
  }

  const handleSupportProject = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
    setSupportData({
      nomeApoiador: "",
      esferaGovernamental: "",
      siglaSecretaria: "",
      valorContribuicao: 0,
    })
  }

  const handleConfirmSupport = () => {
    if (selectedProject && supportData.valorContribuicao > 0) {
      // Atualizar o valor arrecadado do projeto
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProject.id
            ? { ...project, arrecadado: project.arrecadado + supportData.valorContribuicao }
            : project,
        ),
      )

      // Registrar a transação
      addTransaction({
        projectId: selectedProject.id,
        type: "add",
        amount: supportData.valorContribuicao,
        supporter: supportData.nomeApoiador,
        governmentSphere: supportData.esferaGovernamental,
        department: supportData.siglaSecretaria,
      })

      setIsModalOpen(false)
      setSelectedProject(null)
    }
  }

  const handleValueChange = (value: string) => {
    const numericValue = Number.parseFloat(value.replace(/[^\d.,]/g, "").replace(",", ".")) || 0
    setSupportData((prev) => ({ ...prev, valorContribuicao: numericValue }))
  }

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectImages(projectId)
  }

  const handleCloseImagesModal = () => {
    setSelectedProjectImages(null)
  }

  const handleSecretariaClick = (secretariaId: string) => {
    setSelectedSecretaria(secretariaId)
  }

  const handleCloseSecretariaModal = () => {
    setSelectedSecretaria(null)
  }

  const handleRemoveValue = (project: Project) => {
    if (!isAuthenticated || !isAdmin) {
      setShowAdminLoginPrompt(true)
      return
    }

    setSelectedProject(project)
    setIsRemoveModalOpen(true)
    setRemoveData({
      valorRemocao: 0,
      motivo: "",
    })
  }

  const handleConfirmRemoval = () => {
    if (selectedProject && removeData.valorRemocao > 0) {
      // Atualizar o valor arrecadado do projeto
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProject.id
            ? {
                ...project,
                arrecadado: Math.max(0, project.arrecadado - removeData.valorRemocao),
              }
            : project,
        ),
      )

      // Registrar a transação
      addTransaction({
        projectId: selectedProject.id,
        type: "remove",
        amount: removeData.valorRemocao,
        reason: removeData.motivo,
      })

      setIsRemoveModalOpen(false)
      setSelectedProject(null)
    }
  }

  const handleRemoveValueChange = (value: string) => {
    const numericValue = Number.parseFloat(value.replace(/[^\d.,]/g, "").replace(",", ".")) || 0
    setRemoveData((prev) => ({ ...prev, valorRemocao: numericValue }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed w-full bg-white shadow-md z-50 top-0">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src="https://www.curitiba.pr.gov.br/include/design/img/logoPMC.png"
              alt="Logo Prefeitura de Curitiba"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
            <h1 className="text-lg font-bold text-gray-800 hidden md:block">Projetos Estratégicos de Curitiba</h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <a href="#inicio" className="text-blue-600 font-medium hover:text-blue-800">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#sobre" className="text-gray-600 hover:text-blue-600">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#projetos" className="text-gray-600 hover:text-blue-600">
                    Projetos
                  </a>
                </li>
                <li>
                  <a href="#contato" className="text-gray-600 hover:text-blue-600">
                    Contato
                  </a>
                </li>
              </ul>
            </nav>
            {isAuthenticated && isAdmin ? (
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Painel Admin</span>
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-2 px-4 shadow-lg">
            <ul className="space-y-3">
              <li>
                <a href="#inicio" className="block py-2 text-blue-600 font-medium">
                  Início
                </a>
              </li>
              <li>
                <a href="#sobre" className="block py-2 text-gray-600">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#projetos" className="block py-2 text-gray-600">
                  Projetos
                </a>
              </li>
              <li>
                <a href="#contato" className="block py-2 text-gray-600">
                  Contato
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="block py-2 text-gray-600">
                  Acesso Admin
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative pt-24 pb-32 md:pt-32 md:pb-48 bg-cover bg-center"
        style={{ backgroundImage: "url('/back.jpeg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Assessoria Especial de Emendas Parlamentares do Gabinete do Prefeito - GAPEEP
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Conheça os projetos estratégicos que vão transformar nossa cidade nos próximos anos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-white hover:bg-gray-100 text-blue-600">
                <a href="#projetos" className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ver Projetos
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre o Projeto */}
      <section className="py-16 bg-white" id="sobre">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">
              Sinergia Sustentável: Conectando Recursos Governamentais a Projetos Inovadores e Estratégicos
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              A Assessoria Especial do Gabinete do Prefeito que trata das Emendas Parlamentares (GAPEEP) em conjunto com
              a Secretaria do Governo Municipal criou esse sistema para conectar os parlamentares com os projetos
              desenvolvidos em Curitiba. A apresentação de projetos das mais diversas políticas públicas municipais aos
              parlamentares é uma estratégia para garantir que as iniciativas que visam o desenvolvimento e o bem-estar
              da cidade recebam o apoio e os recursos necessários.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 text-left max-w-2xl mx-auto">
              <p className="text-xl font-semibold text-blue-800">
                "Mais de 30 projetos prontos para transformar a cidade."
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-blue-600 mb-4">
                <Compass className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Visão Estratégica</h3>
              <p className="text-gray-600">
                Projetos alinhados com os Objetivos de Desenvolvimento Sustentável da ONU e o Plano Diretor de Curitiba.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-blue-600 mb-4">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Participação Popular</h3>
              <p className="text-gray-600">
                Iniciativas desenvolvidas com ampla participação da sociedade civil e especialistas.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-blue-600 mb-4">
                <TrendingUp className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Desenvolvimento Sustentável</h3>
              <p className="text-gray-600">
                Foco em soluções que equilibram crescimento econômico, inclusão social e preservação ambiental.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Projetos */}
      <section className="py-12 bg-gray-100" id="projetos">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Projetos em destaque no 2º semestre de 2025
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => {
              const progress = calculateProgress(project.arrecadado, project.meta)
              const restante = project.meta - project.arrecadado

              return (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="relative">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={400}
                      height={320}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="relative w-20 h-20">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              strokeDasharray={`${progress}, 100`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-800">{Math.round(progress)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meta:</span>
                          <span className="font-semibold">{formatCurrency(project.meta)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Arrecadado:</span>
                          <span className="font-semibold text-green-600">{formatCurrency(project.arrecadado)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Restante:</span>
                          <span className="font-semibold text-blue-600">{formatCurrency(restante)}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSupportProject(project)
                        }}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Apoiar Projeto
                      </Button>

                      {/* Botão de ajuste só aparece para admin */}
                      {project.arrecadado > 0 && (
                        <Button
                          variant="outline"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveValue(project)
                          }}
                        >
                          {isAdmin ? (
                            "Ajustar Valor"
                          ) : (
                            <span className="flex items-center gap-1">
                              <Lock className="h-3 w-3" /> Ajustar Valor
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Seção Coletâneas de Projetos por Órgão Municipal */}
      <section className="py-12 bg-white" id="secretarias">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Coletâneas de Projetos por Órgão Municipal
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* SMS */}
            <Card
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleSecretariaClick("sms")}
            >
              <Image
                src="/SECRETARIA DA SAUDE.jpeg"
                alt="Secretaria da Saúde"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-gray-800">Secretaria Municipal de Saúde</p>
              </CardContent>
            </Card>

            {/* SMMA */}
            <Card
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleSecretariaClick("smma")}
            >
              <Image
                src="/SECRETARIA MUNICIPAL DO MEIO AMBIENTE.jpeg"
                alt="Secretaria do Meio Ambiente"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-gray-800">Secretaria Municipal do Meio Ambiente</p>
              </CardContent>
            </Card>

            {/* IPPUC */}
            <Card
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleSecretariaClick("ippuc")}
            >
              <Image
                src="/IPPUC - INSTITUTO DE PESQUISA E.jpeg"
                alt="IPPUC"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-gray-800">
                  Instituto de Pesquisa e Planejamento Urbano de Curitiba
                </p>
              </CardContent>
            </Card>

            {/* SMIR */}
            <Card
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleSecretariaClick("smir")}
            >
              <Image
                src="/SECRETARIA MUNICIPAL DA MULHER E.jpeg"
                alt="Secretaria da Mulher"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-gray-800">
                  Secretaria Municipal da Mulher e Igualdade Étnico-Racial
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modal de Apoio */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Apoiar Projeto
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">{selectedProject.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Meta:</span>
                    <div className="font-semibold">{formatCurrency(selectedProject.meta)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Arrecadado:</span>
                    <div className="font-semibold text-green-600">{formatCurrency(selectedProject.arrecadado)}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Restante:</span>
                    <div className="font-semibold text-blue-600">
                      {formatCurrency(selectedProject.meta - selectedProject.arrecadado)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Apoiador *</Label>
                  <Input
                    id="nome"
                    placeholder="Nome do Deputado"
                    value={supportData.nomeApoiador}
                    onChange={(e) => setSupportData((prev) => ({ ...prev, nomeApoiador: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="esfera">Esfera Governamental *</Label>
                  <Select
                    value={supportData.esferaGovernamental}
                    onValueChange={(value) => setSupportData((prev) => ({ ...prev, esferaGovernamental: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="municipal">Municipal</SelectItem>
                      <SelectItem value="estadual">Estadual</SelectItem>
                      <SelectItem value="federal">Federal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sigla">Sigla da Secretaria/Ministério *</Label>
                  <Input
                    id="sigla"
                    placeholder="Ex: SMS, SEDU, MEC"
                    value={supportData.siglaSecretaria}
                    onChange={(e) => setSupportData((prev) => ({ ...prev, siglaSecretaria: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="valor">Valor da Contribuição *</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      R$
                    </span>
                    <Input
                      id="valor"
                      type="text"
                      placeholder="0,00"
                      className="rounded-l-none"
                      onChange={(e) => handleValueChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmSupport}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={
                    !supportData.nomeApoiador ||
                    !supportData.esferaGovernamental ||
                    !supportData.siglaSecretaria ||
                    supportData.valorContribuicao <= 0
                  }
                >
                  ✓ Confirmar Apoio
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Remoção de Valor - Apenas para Admin */}
      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">Ajustar Valor Arrecadado</DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">{selectedProject.title}</h3>
                <div className="text-sm">
                  <span className="text-gray-600">Valor atual arrecadado:</span>
                  <div className="font-semibold text-green-600">{formatCurrency(selectedProject.arrecadado)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="valorRemocao">Valor a Remover *</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      R$
                    </span>
                    <Input
                      id="valorRemocao"
                      type="text"
                      placeholder="0,00"
                      className="rounded-l-none"
                      onChange={(e) => handleRemoveValueChange(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="motivo">Motivo da Remoção *</Label>
                  <Input
                    id="motivo"
                    placeholder="Ex: Correção de valor, cancelamento de emenda..."
                    value={removeData.motivo}
                    onChange={(e) => setRemoveData((prev) => ({ ...prev, motivo: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsRemoveModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmRemoval}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={
                    removeData.valorRemocao <= 0 ||
                    !removeData.motivo ||
                    removeData.valorRemocao > selectedProject.arrecadado
                  }
                >
                  ✓ Confirmar Remoção
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Aviso para Login Admin */}
      <Dialog open={showAdminLoginPrompt} onOpenChange={setShowAdminLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Acesso Restrito
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Apenas administradores podem ajustar valores de projetos. Faça login para continuar.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAdminLoginPrompt(false)}>
                Cancelar
              </Button>
              <Button asChild>
                <Link href="/admin/login">Fazer Login</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modais de Imagens dos Projetos */}
      <Dialog open={selectedProjectImages === "cras-caximba"} onOpenChange={handleCloseImagesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Implantação do CRAS Caximba</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Visualizando imagens da pasta: Implementação CRAS Caximba</p>
            <Image
              src="/Implementação CRAS Caximba/Implementação do CRAS Caximba.jpeg"
              alt="CRAS Caximba - Página 1"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/Implementação CRAS Caximba/Implementação do CRAS Caximba.jpeg"
              alt="CRAS Caximba - Página 2"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedProjectImages === "jornada-digital"} onOpenChange={handleCloseImagesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SMS - JORNADA DIGITAL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Visualizando imagens da pasta: SMDC</p>
            <Image
              src="/SMDC/Projetos.jpeg"
              alt="Jornada Digital - Página 1"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/SMDC/Projetos.jpeg"
              alt="Jornada Digital - Página 2"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/SMDC/Projetos.jpeg"
              alt="Jornada Digital - Página 3"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedProjectImages === "escola-circo"} onOpenChange={handleCloseImagesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Escola de Circo e Marionetes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Visualizando imagens da pasta: E C M</p>
            <Image
              src="/E C M/Escola de circo.jpeg"
              alt="Escola de Circo - Página 1"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/E C M/Escola de circo.jpeg"
              alt="Escola de Circo - Página 2"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedProjectImages === "secretaria-mulher"} onOpenChange={handleCloseImagesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Secretaria Municipal da Mulher e Igualdade Étnico-Racial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Visualizando imagens da pasta: Mulher R</p>
            <Image
              src="/Mulher R/Mulher.jpeg"
              alt="Secretaria da Mulher - Página 1"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/Mulher R/Mulher.jpeg"
              alt="Secretaria da Mulher - Página 2"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/Mulher R/Mulher.jpeg"
              alt="Secretaria da Mulher - Página 3"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/Mulher R/Mulher.jpeg"
              alt="Secretaria da Mulher - Página 4"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedProjectImages === "app-mulheres"} onOpenChange={handleCloseImagesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aplicativo Mulheres</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Visualizando imagens da pasta: APP MULHER</p>
            <Image
              src="/APP MULHER/App mulher.jpeg"
              alt="App Mulheres - Página 1"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/APP MULHER/App mulher.jpeg"
              alt="App Mulheres - Página 2"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/APP MULHER/App mulher.jpeg"
              alt="App Mulheres - Página 3"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/APP MULHER/App mulher.jpeg"
              alt="App Mulheres - Página 4"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedProjectImages === "meio-ambiente"} onOpenChange={handleCloseImagesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Secretaria Municipal do Meio Ambiente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Visualizando imagens da pasta: AMBIENTE</p>
            <Image
              src="/AMBIENTE/ambiente.jpeg"
              alt="Meio Ambiente - Página 1"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/AMBIENTE/ambiente.jpeg"
              alt="Meio Ambiente - Página 2"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedProjectImages === "museu-historia"} onOpenChange={handleCloseImagesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Museu de História Natural de Curitiba</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Visualizando imagens da pasta: Museu</p>
            <Image
              src="/Museu/Museu.jpeg"
              alt="Museu História - Página 1"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/Museu/Museu.jpeg"
              alt="Museu História - Página 2"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/Museu/Museu.jpeg"
              alt="Museu História - Página 3"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedProjectImages === "hospital-bairro-novo"} onOpenChange={handleCloseImagesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Construção do novo Hospital do Bairro Novo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Visualizando imagens da pasta: Hospital</p>
            <Image
              src="/Hospital/hospital.jpeg"
              alt="Hospital Bairro Novo - Página 1"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/Hospital/hospital.jpeg"
              alt="Hospital Bairro Novo - Página 2"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
            <Image
              src="/Hospital/hospital.jpeg"
              alt="Hospital Bairro Novo - Página 3"
              width={600}
              height={800}
              className="w-full rounded shadow"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modais das Secretarias com PDFs */}
      <Dialog open={selectedSecretaria === "sms"} onOpenChange={handleCloseSecretariaModal}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>SMS - Secretaria Municipal de Saúde</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[80vh]">
            <iframe
              src="/SMS- SECRETARIA MUNICIPAL DE SAÚDE.pdf"
              className="w-full h-full border-0 rounded"
              title="SMS - Projetos da Secretaria Municipal de Saúde"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedSecretaria === "smma"} onOpenChange={handleCloseSecretariaModal}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>SMMA - Secretaria Municipal do Meio Ambiente</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[80vh]">
            <iframe
              src="/SMMA - SECRETARIA MUNICIPAL DO MEIO AMBIENTE.pdf"
              className="w-full h-full border-0 rounded"
              title="SMMA - Projetos da Secretaria Municipal do Meio Ambiente"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedSecretaria === "ippuc"} onOpenChange={handleCloseSecretariaModal}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>IPPUC - Instituto de Pesquisa e Planejamento Urbano de Curitiba</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[80vh]">
            <iframe
              src="/IPPUC - Instituto de Pesquisa e Planejamento Urbano de Curitiba.pdf"
              className="w-full h-full border-0 rounded"
              title="IPPUC - Projetos do Instituto de Pesquisa e Planejamento Urbano"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedSecretaria === "smir"} onOpenChange={handleCloseSecretariaModal}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>SMIR - Secretaria Municipal da Mulher e Igualdade Étnico-Racial</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[80vh]">
            <iframe
              src="/PROJETOS SMIR - SECRETARIA MUNICIPAL DA MULHER E IGUALDADE ÉTNICO-RACIAL.pdf"
              className="w-full h-full border-0 rounded"
              title="SMIR - Projetos da Secretaria da Mulher e Igualdade Étnico-Racial"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Seção Contato */}
      <section className="py-16 bg-gray-800 text-white" id="contato">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Dúvidas sobre os Projetos?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
            <div className="space-y-2">
              <div className="flex gap-2 items-start">
                <MapPin className="text-blue-400 mt-1 h-4 w-4" />
                <div>
                  <p className="font-bold">Secretaria Municipal de Saúde</p>
                  <p>Rua Francisco Torres, 830 - Centro, Curitiba - PR, 80060-130</p>
                  <p>
                    <strong>Telefone:</strong> (41) 3350-9429 | 0800 644 0041
                  </p>
                  <p>
                    <strong>Atendimento:</strong> 8h às 18h, seg. a sex.
                  </p>
                  <p>
                    <strong>E-mail:</strong> ouvidoria@sms.curitiba.pr.gov.br
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2 items-start">
                <Phone className="text-green-400 mt-1 h-4 w-4" />
                <div>
                  <p className="font-bold">Secretaria Municipal do Meio Ambiente</p>
                  <p>Av. Manoel Ribas, 2727, Mercês - CEP 80810-000</p>
                  <p>
                    <strong>Telefone:</strong> (41) 3350-8484
                  </p>
                  <p>
                    <strong>Atendimento:</strong> 8h às 12h e 14h às 18h, seg. a sex.
                  </p>
                  <p>
                    <strong>E-mail:</strong> smma@curitiba.pr.gov.br
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2 items-start">
                <Users className="text-pink-400 mt-1 h-4 w-4" />
                <div>
                  <p className="font-bold">Secretaria da Mulher e Igualdade Étnico-Racial</p>
                  <p>
                    <strong>Telefone:</strong> (41) 3221-2746
                  </p>
                  <p>
                    <strong>Atendimento:</strong> 8h às 12h e 14h às 18h, seg. a sex.
                  </p>
                  <p>
                    <strong>E-mails:</strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>smir@curitiba.pr.gov.br</li>
                    <li>igualdaderacial@curitiba.pr.gov.br</li>
                    <li>diversidadesexual@curitiba.pr.gov.br</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2 items-start">
                <Globe className="text-yellow-400 mt-1 h-4 w-4" />
                <div>
                  <p className="font-bold">Planejamento Urbano de Curitiba</p>
                  <p>Rua Bom Jesus, 669, Cabral</p>
                  <p>
                    <strong>Telefone:</strong> 3250-1414
                  </p>
                  <p>
                    <strong>Atendimento:</strong> 8h às 12h e 14h às 18h, seg. a sex.
                  </p>
                  <p>
                    <strong>E-mail:</strong> ippuc@ippuc.org.br
                  </p>
                  <p>
                    <strong>Site:</strong> www.ippuc.org.br
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
