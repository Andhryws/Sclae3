import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "./firebase/config";



import { Picker } from "@react-native-picker/picker";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";


const Stack = createNativeStackNavigator();


// =====================================================
// TELA DE LOGIN
// =====================================================


function TelaLogin({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");


async function realizarLogin() {
  if (!email.trim() || !senha) {
    Alert.alert("Atenção", "Informe seu e-mail e sua senha.");
    return;
  }

  try {
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      senha
    );

    navigation.replace("Inicio");
  } catch (erro) {
    console.log("Erro no login:", erro.code, erro.message);

    Alert.alert(
      "Falha no login",
      "Não foi possível entrar. Confira seu e-mail e senha."
    );
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SCLAE</Text>


      <Text style={styles.subtitulo}>
        Sistema de Controle de Laboratórios e Equipamentos
      </Text>


      <View style={styles.formulario}>
        <Text style={styles.label}>E-mail</Text>


        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />


        <Text style={styles.label}>Senha</Text>


        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />


        <TouchableOpacity
          style={styles.botao}
          onPress={realizarLogin}
        >
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.link}>
            Ainda não possui uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


// =====================================================
// TELA DE CADASTRO
// =====================================================


function TelaCadastro({ navigation }) {
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [siape, setSiape] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [confirmarSenha, setConfirmarSenha] = React.useState("");
  const [tipoUsuario, setTipoUsuario] = React.useState("");

  
async function cadastrarUsuario() {
  if (
    !nome.trim() ||
    !email.trim() ||
    !siape.trim() ||
    !senha ||
    !confirmarSenha ||
    !tipoUsuario
  ) {
    Alert.alert("Atenção", "Preencha todos os campos.");
    return;
  }

  if (senha !== confirmarSenha) {
    Alert.alert("Atenção", "As senhas não coincidem.");
    return;
  }

  if (senha.length < 6) {
    Alert.alert(
      "Atenção",
      "A senha precisa ter pelo menos 6 caracteres."
    );
    return;
  }

  try {
    const credencial = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      senha
    );

    await setDoc(doc(db, "usuarios", credencial.user.uid), {
      nome: nome.trim(),
      email: email.trim(),
      siape: siape.trim(),
      tipoUsuario: tipoUsuario,
      criadoEm: serverTimestamp(),
    });

    await signOut(auth);

    Alert.alert(
      "Cadastro realizado!",
      "Sua conta foi criada com sucesso."
    );

    navigation.navigate("Login");
  } catch (erro) {
    console.log("Erro no cadastro:", erro.code, erro.message);

    let mensagem = "Não foi possível concluir o cadastro.";

    if (erro.code === "auth/email-already-in-use") {
      mensagem = "Este e-mail já possui uma conta cadastrada.";
    } else if (erro.code === "auth/invalid-email") {
      mensagem = "O e-mail informado é inválido.";
    } else if (erro.code === "auth/weak-password") {
      mensagem = "A senha é muito fraca.";
    } else if (erro.code === "permission-denied") {
      mensagem =
        "A conta pode ter sido criada, mas o banco recusou o salvamento dos dados. Verifique as regras do Firestore.";
    }

    Alert.alert("Erro no cadastro", mensagem);
  }
}


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Criar conta</Text>


      <Text>Preencha os dados para criar seu acesso</Text>


      <View style={styles.formulario}>
        <Text style={styles.label}>Nome</Text>


        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
        />


        <Text style={styles.label}>E-mail</Text>


        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />


        <Text style={styles.label}>SIAPE</Text>


        <TextInput
          style={styles.input}
          placeholder="Digite seu SIAPE"
          value={siape}
          onChangeText={setSiape}
        />


        <Text style={styles.label}>Senha</Text>


        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />


        <Text style={styles.label}>Confirmar Senha</Text>


        <TextInput
          style={styles.input}
          placeholder="Digite sua senha novamente"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />


        <Text style={styles.label}>Tipo de usuário</Text>


        <View style={styles.input}>
          <Picker
            selectedValue={tipoUsuario}
            onValueChange={(itemValue) => setTipoUsuario(itemValue)}
          >
            <Picker.Item label="Selecione o tipo de usuário" value="" />
            <Picker.Item label="Docente" value="docente" />
            <Picker.Item label="Servidor" value="servidor" />
          </Picker>
        </View>


        <TouchableOpacity
          style={styles.botao}
          onPress={cadastrarUsuario}
        >
          <Text style={styles.textoBotao}>Cadastrar</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


// =====================================================
// MENU INFERIOR
// =====================================================


function MenuInferior({ navigation, telaAtual }) {
  return (
    <View style={styles.menuInferior}>
      <TouchableOpacity
        style={styles.itemMenu}
        onPress={() => navigation.navigate("Inicio")}
      >
        <Text style={styles.iconeMenu}>⌂</Text>
        <Text
          style={[styles.textoMenu, telaAtual === "Inicio" && styles.menuAtivo]}
        >
          Início
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.itemMenu}
        onPress={() => navigation.navigate("Ambientes")}
      >
        <Text style={styles.iconeMenu}>▥</Text>
        <Text
          style={[
            styles.textoMenu,
            telaAtual === "Ambientes" && styles.menuAtivo,
          ]}
        >
          Ambientes
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.itemMenu}
        onPress={() => navigation.navigate("Reservas")}
      >
        <Text style={styles.iconeMenu}>▦</Text>
        <Text
          style={[
            styles.textoMenu,
            telaAtual === "Reservas" && styles.menuAtivo,
          ]}
        >
          Reservas
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.itemMenu}
        onPress={() => navigation.navigate("Perfil")}
      >
        <Text style={styles.iconeMenu}>♙</Text>


        <Text
          style={[styles.textoMenu, telaAtual === "Perfil" && styles.menuAtivo]}
        >
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
}


// =====================================================
// CABEÇALHO
// =====================================================


function Cabecalho({ navigation, titulo, voltar = false }) {
  return (
    <View style={styles.cabecalho}>
      {voltar ? (
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.setaVoltar}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.logoArea}>
          <View style={styles.logoIcone}>
            <Text style={styles.logoSimbolo}>▰</Text>
          </View>


          <Text style={styles.logoPequeno}>SCLAE</Text>
        </View>
      )}


      {voltar && <Text style={styles.tituloCabecalho}>{titulo}</Text>}


      {!voltar && (
        <View style={styles.perfilIcone}>
          <Text style={styles.perfilTexto}>♙</Text>
        </View>
      )}
    </View>
  );
}


// =====================================================
// TELA INICIAL
// =====================================================


function TelaInicio({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.tela}>
        <ScrollView
          contentContainerStyle={styles.conteudoInicio}
          showsVerticalScrollIndicator={false}
        >
          <Cabecalho navigation={navigation} />


          <Text style={styles.tituloSaudacao}>Olá, Ana Paula!</Text>


          <Text style={styles.subtituloSaudacao}>
            O que você deseja fazer hoje?
          </Text>


          {/* AÇÕES */}


          <View style={styles.acoes}>
            <TouchableOpacity
              style={styles.cardAcao}
              onPress={() => navigation.navigate("Ambientes")}
            >
              <View style={styles.iconeAcao}>
                <Text style={styles.iconeAcaoTexto}>▣</Text>
              </View>


              <Text style={styles.textoAcao}>RESERVAR</Text>
              <Text style={styles.textoAcao}>SALA/LAB</Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.cardAcao}
              onPress={() =>
               
                 navigation.navigate("Ocorrencia")
               
              }
            >
              <View style={styles.iconeAcao}>
                <Text style={styles.iconeAcaoTexto}>△</Text>
              </View>


              <Text style={styles.textoAcao}>Registrar</Text>
              <Text style={styles.textoAcao}>ocorrência</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={styles.botaoPrincipal}
                onPress={() => navigation.navigate("Admin")}
              >
                <Text style={styles.textoBotaoPrincipal}>
                  Área administrativa
                </Text>
              </TouchableOpacity>
          </View>


          {/* MINHAS RESERVAS */}


          <Text style={styles.tituloSecao}>Minhas reservas</Text>


          <View style={styles.cardReserva}>
            <View>
              <Text style={styles.reservaTitulo}>
                Laboratório de{"\n"}Informática 01
              </Text>


              <Text style={styles.reservaData}>24/09/2026 • 08:00 - 10:00</Text>


              <Text style={styles.reservaDescricao}>Aula de Informática</Text>
            </View>


            <View style={styles.statusConfirmada}>
              <Text style={styles.statusTexto}>• Confirmada</Text>
            </View>
          </View>

        </ScrollView>

        

        <MenuInferior navigation={navigation} telaAtual="Inicio" />
      </View>
    </SafeAreaView>
  );
}


// =====================================================
// TELA RESERVAR SALA/LAB
// =====================================================


function TelaAmbientes({ navigation }) {
  const ambientes = [
    {
      nome: "Sala 01",
      capacidade: "40 pessoas",
      local: "Bloco A • 1º andar",
      equipamentos: "Projetor, 40 carteiras, ar-condicionado",
      status: "Disponível agora",
      tipo: "disponivel",
    },


    {
      nome: "Sala 03",
      capacidade: "35 pessoas",
      local: "Bloco A • 1º andar",
      equipamentos: "Projetor, 35 carteiras, ar-condicionado",
      status: "Ocupado até 10:00",
      tipo: "ocupado",
    },


    {
      nome: "Laboratório de Informática 01",
      capacidade: "30 pessoas",
      local: "Bloco B • Térreo",
      equipamentos: "30 computadores, projetor, ar-condicionado",
      status: "Disponível agora",
      tipo: "disponivel",
    },


    {
      nome: "Laboratório de Informática 02",
      capacidade: "25 pessoas",
      local: "Bloco B • Térreo",
      equipamentos: "25 computadores, projetor",
      status: "Em manutenção",
      tipo: "manutencao",
    },
  ];


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.tela}>
        <View style={styles.conteudoAmbientes}>
          <Cabecalho
            navigation={navigation}
            titulo="Reservar Sala/Lab"
            voltar={true}
          />


          <Text style={styles.instrucao}>
            Escolha um ambiente para consultar equipamentos e disponibilidade.
          </Text>


          <TextInput
            style={styles.busca}
            placeholder="Pesquisar sala ou laboratório..."
            placeholderTextColor="#999"
          />


          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listaAmbientes}
          >
            {ambientes.map((ambiente, index) => (
              <View style={styles.cardAmbiente} key={index}>
                <View style={styles.linhaAmbiente}>
                  <View style={styles.infoAmbiente}>
                    <Text style={styles.nomeAmbiente}>{ambiente.nome}</Text>


                    <Text style={styles.detalheAmbiente}>
                      {ambiente.capacidade} • {ambiente.local}
                    </Text>


                    <Text style={styles.equipamentos}>
                      {ambiente.equipamentos}
                    </Text>
                  </View>


                  <View
                    style={[
                      styles.statusAmbiente,
                      ambiente.tipo === "ocupado" && styles.statusOcupado,
                      ambiente.tipo === "manutencao" && styles.statusManutencao,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusAmbienteTexto,
                        ambiente.tipo === "ocupado" &&
                          styles.statusOcupadoTexto,
                        ambiente.tipo === "manutencao" &&
                          styles.statusManutencaoTexto,
                      ]}
                    >
                      • {ambiente.status}
                    </Text>
                  </View>
                </View>


                <TouchableOpacity
                  style={styles.botaoReservar}
                  onPress={() => {
                    if (ambiente.tipo === "disponivel") {
                      navigation.navigate("DetalhesAmbiente", {
                        ambiente: ambiente,
                      });
                    } else {
                      Alert.alert("Ambiente indisponível", ambiente.status);
                    }
                  }}
                >
                  <Text style={styles.textoReservar}>Reservar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>


        <MenuInferior navigation={navigation} telaAtual="Ambientes" />
      </View>
    </SafeAreaView>
  );
}


// =====================================================
// TELA DE DETALHES E SOLICITAÇÃO DE RESERVA
// =====================================================


function TelaDetalhesAmbiente({ navigation, route }) {
  const ambiente = route.params.ambiente;


  const [data, setData] = React.useState("");
  const [horaInicial, setHoraInicial] = React.useState("");
  const [horaFinal, setHoraFinal] = React.useState("");


  function realizarReserva() {
    if (!data || !horaInicial || !horaFinal) {
      Alert.alert(
        "Preencha os dados",
        "Informe a data e os horários da reserva.",
      );
      return;
    }


    Alert.alert(
      "Reserva realizada",
      `${ambiente.nome} reservado para ${data}, das ${horaInicial} às ${horaFinal}.`,
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Reservas"),
        },
      ],
    );
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.tela}>
        <ScrollView
          contentContainerStyle={styles.detalhesContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* CABEÇALHO */}


          <View style={styles.cabecalhoDetalhes}>
            <TouchableOpacity
              style={styles.botaoVoltarDetalhes}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.setaVoltar}>‹</Text>
            </TouchableOpacity>


            <Text style={styles.nomeDetalhes}>{ambiente.nome}</Text>


            <View style={styles.espacoCabecalho} />
          </View>


          {/* STATUS */}


          <View style={styles.statusDisponivel}>
            <Text style={styles.statusDisponivelTexto}>• Disponível</Text>
          </View>


          {/* EQUIPAMENTOS */}


          <Text style={styles.tituloEquipamentos}>
            Equipamentos e estrutura
          </Text>


          <View style={styles.itemEquipamento}>
            <Text style={styles.iconeEquipamento}>▱</Text>
            <Text style={styles.textoEquipamento}>Projetor</Text>
          </View>


          <View style={styles.itemEquipamento}>
            <Text style={styles.iconeEquipamento}>▱</Text>
            <Text style={styles.textoEquipamento}>
              {ambiente.nome === "Sala 01"
                ? "40 carteiras"
                : ambiente.nome.includes("Informática")
                  ? "Computadores"
                  : "35 carteiras"}
            </Text>
          </View>


          <View style={styles.itemEquipamento}>
            <Text style={styles.iconeEquipamento}>≋</Text>
            <Text style={styles.textoEquipamento}>Ar-condicionado</Text>
          </View>


          {/* SOLICITAR RESERVA */}


          <Text style={styles.tituloSolicitar}>Solicitar reserva</Text>


          <Text style={styles.labelReserva}>Data</Text>


          <TextInput
            style={styles.inputReserva}
            placeholder="dd/mm/aaaa"
            placeholderTextColor="#777"
            value={data}
            onChangeText={setData}
          />


          <View style={styles.linhaHorario}>
            <View style={styles.campoHorario}>
              <Text style={styles.labelReserva}>Horário inicial</Text>


              <TextInput
                style={styles.inputHorario}
                placeholder="--:--"
                placeholderTextColor="#777"
                value={horaInicial}
                onChangeText={setHoraInicial}
              />
            </View>


            <View style={styles.campoHorario}>
              <Text style={styles.labelReserva}>Horário final</Text>


              <TextInput
                style={styles.inputHorario}
                placeholder="--:--"
                placeholderTextColor="#777"
                value={horaFinal}
                onChangeText={setHoraFinal}
              />
            </View>
          </View>


          <TouchableOpacity
            style={styles.botaoReservarAgora}
            onPress={realizarReserva}
          >
            <Text style={styles.textoReservarAgora}>Reservar agora</Text>
          </TouchableOpacity>


          {/* ESTRUTURA - ABAIXO DA SOLICITAÇÃO */}


          <Text style={styles.tituloEstrutura}>Estrutura do ambiente</Text>


          <View style={styles.infoEstrutura}>
            <View style={styles.blocoInformacao}>
              <Text style={styles.tituloInformacao}>Capacidade</Text>


              <Text style={styles.valorInformacao}>{ambiente.capacidade}</Text>
            </View>


            <View style={styles.blocoInformacao}>
              <Text style={styles.tituloInformacao}>Localização</Text>


              <Text style={styles.valorInformacao}>{ambiente.local}</Text>
            </View>
          </View>


          <TouchableOpacity
            style={styles.outroAmbiente}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoOutroAmbiente}>
              Escolher outro ambiente
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


// =====================================================
// TELA MINHAS RESERVAS
// =====================================================


function TelaReservas({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.tela}>
        <ScrollView
          contentContainerStyle={styles.conteudoInicio}
          showsVerticalScrollIndicator={false}
        >
          <Cabecalho navigation={navigation} />


          <Text style={styles.tituloPagina}>Minhas reservas</Text>


          <View style={styles.cardReservaGrande}>
            <View>
              <Text style={styles.reservaTitulo}>
                Laboratório de{"\n"}Informática 01
              </Text>


              <Text style={styles.reservaData}>24/09/2026 • 08:00 - 10:00</Text>


              <Text style={styles.reservaDescricao}>Aula de Informática</Text>
            </View>


            <View style={styles.statusConfirmada}>
              <Text style={styles.statusTexto}>• Confirmada</Text>
            </View>
          </View>


          <TouchableOpacity
            style={styles.botaoPrincipal}
            onPress={() => navigation.navigate("Ambientes")}
          >
            <Text style={styles.textoBotaoPrincipal}>Fazer nova reserva</Text>
          </TouchableOpacity>
        </ScrollView>


        <MenuInferior navigation={navigation} telaAtual="Reservas" />
      </View>
    </SafeAreaView>
  );
}


// =====================================================
// TELA DE PERFIL
// =====================================================


function TelaPerfil({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.tela}>
        <ScrollView contentContainerStyle={styles.conteudoInicio}>
          <Cabecalho navigation={navigation} />


          <Text style={styles.tituloPagina}>Perfil</Text>


          <View style={styles.cardPerfil}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>AP</Text>
            </View>


            <Text style={styles.nomePerfil}>Ana Paula</Text>


            <Text style={styles.emailPerfil}>Usuário do SCLAE</Text>
          </View>
        </ScrollView>


        <MenuInferior navigation={navigation} telaAtual="Perfil" />
      </View>
    </SafeAreaView>
  );
}


// TelaOcorrencia
function TelaOcorrencia({ navigation }) {
  const [ambiente, setAmbiente] = React.useState("Sala 03");
  const [equipamento, setEquipamento] = React.useState("Projetor");
  const [descricao, setDescricao] = React.useState(
    "O projetor da Sala 03 não está funcionando.",
  );
  const [categoria, setCategoria] = React.useState("Equipamento");


  function registrarOcorrencia() {
    if (!descricao.trim()) {
      Alert.alert(
        "Campo obrigatório",
        "Descreva o problema antes de registrar.",
      );
      return;
    }


    Alert.alert(
      "Ocorrência registrada!",
      "Sua ocorrência foi registrada com sucesso.",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Inicio"),
        },
      ],
    );
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
  <View style={styles.tela}>
    <ScrollView
      contentContainerStyle={styles.conteudoInicio}
      showsVerticalScrollIndicator={false}
    >
      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        <TouchableOpacity
          style={styles.botaoVoltarDetalhes}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.setaVoltar}>‹</Text>
        </TouchableOpacity>


        <Text style={styles.tituloCabecalho}>
          Registrar ocorrência
        </Text>
      </View>


      <Text style={styles.subtitulo}>
        Descreva o problema para que a equipe responsável possa
        acompanhá-lo.
      </Text>


      {/* AMBIENTE */}
      <Text style={styles.label}>Ambiente</Text>


      <View style={styles.input}>
        <Picker
          selectedValue={ambiente}
          onValueChange={setAmbiente}
        >
          <Picker.Item label="Sala 01" value="Sala 01" />
          <Picker.Item label="Sala 03" value="Sala 03" />
          <Picker.Item
            label="Laboratório de Informática 01"
            value="Laboratório de Informática 01"
          />
          <Picker.Item
            label="Laboratório de Informática 02"
            value="Laboratório de Informática 02"
          />
        </Picker>
      </View>


      {/* EQUIPAMENTO */}
      <Text style={styles.label}>Equipamento ou item</Text>


      <View style={styles.input}>
        <Picker
          selectedValue={equipamento}
          onValueChange={setEquipamento}
        >
          <Picker.Item label="Projetor" value="Projetor" />
          <Picker.Item
            label="Ar-condicionado"
            value="Ar-condicionado"
          />
          <Picker.Item label="Computador" value="Computador" />
          <Picker.Item label="Sistema de som" value="Sistema de som" />
          <Picker.Item label="Outro" value="Outro" />
        </Picker>
      </View>


      {/* DESCRIÇÃO */}
      <Text style={styles.label}>Descrição</Text>


      <TextInput
        style={[styles.input, { height: 103, textAlignVertical: "top" }]}
        placeholder="Descreva o problema encontrado..."
        placeholderTextColor="#82918A"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />


      {/* CATEGORIA */}
      <Text style={styles.label}>Categoria</Text>


      <View style={styles.input}>
        <Picker
          selectedValue={categoria}
          onValueChange={setCategoria}
        >
          <Picker.Item label="Equipamento" value="Equipamento" />
          <Picker.Item
            label="Infraestrutura"
            value="Infraestrutura"
          />
          <Picker.Item label="Limpeza" value="Limpeza" />
          <Picker.Item label="Outro" value="Outro" />
        </Picker>
      </View>


      {/* BOTÃO */}
      <TouchableOpacity
        style={styles.botaoPrincipal}
        onPress={registrarOcorrencia}
      >
        <Text style={styles.textoBotaoPrincipal}>
          Registrar ocorrência
        </Text>
      </TouchableOpacity>
    </ScrollView>


    <MenuInferior
      navigation={navigation}
      telaAtual="Ocorrencia"
    />
  </View>
</SafeAreaView>
  );
}

// =====================================================
// TELA ADMINISTRADOR
// =====================================================

function TelaAdmin({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.tela}>
        <ScrollView
          contentContainerStyle={styles.conteudoInicio}
          showsVerticalScrollIndicator={false}
        >
          <Cabecalho
          navigation={navigation}
          titulo="Administração"
          voltar
        />
        
        <Text style={styles.tituloPagina}>Tela de administração</Text>

        <Text style={styles.subtituloOcorrencia}> Gerencie os ambientes, equipamentos e ocorrências do SCLAE. </Text>

      <TouchableOpacity
        style={styles.botaoPrincipal}
        onPress={() => navigation.navigate("GerenciarLaboratorios")}
      >
        <Text style={styles.textoBotaoPrincipal}>
          Gerenciar Ambientes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoPrincipal}
        onPress={() => navigation.navigate("GerenciarEquipamentos")}
      >
        <Text style={styles.textoBotaoPrincipal}>
          Gerenciar 
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoPrincipal}
        onPress={() => navigation.navigate("GerenciarOcorrencias")}
      >
        <Text style={styles.textoBotaoPrincipal}>
          Gerenciar Ocorrências
        </Text>
      </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


// =====================================================
// TELA GERENCIAR LABORATÓRIOS
// =====================================================


function TelaGerenciarLaboratorios({ navigation }) {
  const [nome, setNome] = React.useState("");
  const [localizacao, setLocalizacao] = React.useState("");
  const [capacidade, setCapacidade] = React.useState("");
  const [equipamentos, setEquipamentos] = React.useState("");

  const [laboratorios, setLaboratorios] = React.useState([]);
  const [editandoId, setEditandoId] = React.useState(null);

  function salvarLaboratorio() {
    if (!nome.trim() || !localizacao.trim() || !capacidade.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha o nome, a localização e a capacidade."
      );
      return;
    }

    const laboratorio = {
      id: editandoId ?? Date.now().toString(),
      nome: nome.trim(),
      localizacao: localizacao.trim(),
      capacidade: Number(capacidade),
      equipamentos: equipamentos
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (
      !Number.isInteger(laboratorio.capacidade) ||
      laboratorio.capacidade <= 0
    ) {
      Alert.alert("Capacidade inválida", "Informe um número inteiro maior que zero.");
      return;
    }

    if (editandoId) {
      setLaboratorios((lista) =>
        lista.map((item) =>
          item.id === editandoId ? laboratorio : item
        )
      );
    } else {
      setLaboratorios((lista) => [...lista, laboratorio]);
    }

    limparFormulario();
  }

  function limparFormulario() {
    setNome("");
    setLocalizacao("");
    setCapacidade("");
    setEquipamentos("");
    setEditandoId(null);
  }

  function editarLaboratorio(laboratorio) {
    setNome(laboratorio.nome);
    setLocalizacao(laboratorio.localizacao);
    setCapacidade(String(laboratorio.capacidade));
    setEquipamentos(laboratorio.equipamentos.join(", "));
    setEditandoId(laboratorio.id);
  }

  function excluirLaboratorio(id) {
    Alert.alert(
      "Excluir laboratório",
      "Deseja realmente excluir este laboratório?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setLaboratorios((lista) =>
              lista.filter((item) => item.id !== id)
            );

            if (editandoId === id) {
              limparFormulario();
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.tela}>
        <ScrollView
          contentContainerStyle={styles.conteudoInicio}
          showsVerticalScrollIndicator={false}
        >
          <Cabecalho
            navigation={navigation}
            titulo="Laboratórios"
            voltar
          />

          <Text style={styles.tituloPagina}>
            Gerenciar laboratórios
          </Text>

          <Text style={styles.labelOcorrencia}>Nome do laboratório</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Laboratório de Informática 01"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.labelOcorrencia}>Localização</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Bloco A, sala 03"
            value={localizacao}
            onChangeText={setLocalizacao}
          />

          <Text style={styles.labelOcorrencia}>Capacidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantidade de pessoas"
            value={capacidade}
            onChangeText={setCapacidade}
            keyboardType="number-pad"
          />

          <Text style={styles.labelOcorrencia}>Equipamentos</Text>
          <TextInput
            style={styles.input}
            placeholder="Computadores, projetor, ar-condicionado"
            value={equipamentos}
            onChangeText={setEquipamentos}
          />

          <TouchableOpacity
            style={styles.botaoPrincipal}
            onPress={salvarLaboratorio}
          >
            <Text style={styles.textoBotaoPrincipal}>
              {editandoId ? "Salvar alterações" : "Cadastrar laboratório"}
            </Text>
          </TouchableOpacity>

          {editandoId && (
            <TouchableOpacity onPress={limparFormulario}>
              <Text style={styles.link}>Cancelar edição</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.tituloPagina}>
            Laboratórios cadastrados
          </Text>

          {laboratorios.length === 0 ? (
            <Text style={styles.subtituloOcorrencia}>
              Nenhum laboratório cadastrado nesta sessão.
            </Text>
          ) : (
            laboratorios.map((laboratorio) => (
              <View
                key={laboratorio.id}
                style={styles.cardReservaGrande}
              >
                <Text style={styles.reservaTitulo}>
                  {laboratorio.nome}
                </Text>

                <Text style={styles.reservaDescricao}>
                  Localização: {laboratorio.localizacao}
                </Text>

                <Text style={styles.reservaDescricao}>
                  Capacidade: {laboratorio.capacidade} pessoas
                </Text>

                <Text style={styles.reservaDescricao}>
                  Equipamentos: {laboratorio.equipamentos.join(", ") || "Nenhum informado"}
                </Text>

                <View style={{ flexDirection: "row", marginTop: 12 }}>
                  <TouchableOpacity
                    style={{ marginRight: 24 }}
                    onPress={() => editarLaboratorio(laboratorio)}
                  >
                    <Text style={styles.link}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => excluirLaboratorio(laboratorio.id)}
                  >
                    <Text style={{ color: "#C62828", fontWeight: "bold" }}>
                      Excluir
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


// =====================================================
// NAVEGAÇÃO
// =====================================================


export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* LOGIN E CADASTRO MANTIDOS */}


          <Stack.Screen name="Login" component={TelaLogin} />


          <Stack.Screen name="Cadastro" component={TelaCadastro} />


          {/* SISTEMA */}


          <Stack.Screen name="Inicio" component={TelaInicio} />


          <Stack.Screen name="Ambientes" component={TelaAmbientes} />


          <Stack.Screen
            name="DetalhesAmbiente"
            component={TelaDetalhesAmbiente}
          />


          <Stack.Screen name="Reservas" component={TelaReservas} />


          <Stack.Screen name="Perfil" component={TelaPerfil} />


          <Stack.Screen
            name="Ocorrencia"
            component={TelaOcorrencia}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="GerenciarLaboratorios"
            component={TelaGerenciarLaboratorios}
            options={{ headerShown: false }} 
         />

        <Stack.Screen
          name="Admin"
          component={TelaAdmin}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


// =====================================================
// ESTILOS
// =====================================================


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },


  tela: {
    flex: 1,
    backgroundColor: "#F8FAF9",
  },


  // LOGIN / CADASTRO


  formulario: {
    width: "100%",
    maxWidth: 350,
    marginTop: 20,
  },


  logo: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#149E02",
    marginBottom: 10,
  },


  subtitulo: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 10,
  },


  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },


  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },


  input: {
    backgroundColor: "#FFF",
    height: 48,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },


  botao: {
    backgroundColor: "#149E02",
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 15,
  },


  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },


  link: {
    color: "#149E02",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },


  // CABEÇALHO


  conteudoInicio: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 90,
  },


  conteudoAmbientes: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 12,
  },


  cabecalho: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },


  logoArea: {
    flexDirection: "row",
    alignItems: "center",
  },


  logoIcone: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#177B4C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },


  logoSimbolo: {
    color: "#FFF",
    fontSize: 10,
  },


  logoPequeno: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#177B4C",
  },


  perfilIcone: {
    width: 31,
    height: 31,
    borderRadius: 20,
    backgroundColor: "#E4F1E9",
    alignItems: "center",
    justifyContent: "center",
  },


  perfilTexto: {
    fontSize: 18,
    color: "#609B7A",
  },


  botaoVoltar: {
    width: 30,
    height: 30,
    justifyContent: "center",
  },


  setaVoltar: {
    fontSize: 32,
    color: "#333",
    lineHeight: 30,
  },


  tituloCabecalho: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#26332D",
    marginLeft: 5,
  },


  // INÍCIO


  tituloSaudacao: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#26332D",
  },


  subtituloSaudacao: {
    color: "#8A928E",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 18,
  },


  acoes: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 23,
  },


  cardAcao: {
    flex: 1,
    minHeight: 115,
    backgroundColor: "#FFF",
    borderRadius: 13,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5EAE7",
  },


  iconeAcao: {
    width: 31,
    height: 31,
    borderRadius: 9,
    backgroundColor: "#E7F4EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },


  iconeAcaoTexto: {
    color: "#278256",
    fontSize: 17,
    fontWeight: "bold",
  },


  textoAcao: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#37443E",
    lineHeight: 15,
  },


  tituloSecao: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#35423B",
    marginBottom: 9,
  },


  cardReserva: {
    backgroundColor: "#FFF",
    borderRadius: 13,
    padding: 13,
    minHeight: 112,
    borderWidth: 1,
    borderColor: "#E5EAE7",
    flexDirection: "row",
    justifyContent: "space-between",
  },


  reservaTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#35423B",
    lineHeight: 17,
  },


  reservaData: {
    fontSize: 11,
    color: "#727A76",
    marginTop: 6,
  },


  reservaDescricao: {
    fontSize: 11,
    color: "#727A76",
    marginTop: 7,
  },


  statusConfirmada: {
    backgroundColor: "#E7F5EB",
    borderRadius: 25,
    paddingHorizontal: 11,
    paddingVertical: 8,
    height: 38,
  },


  statusTexto: {
    color: "#39805A",
    fontSize: 11,
    fontWeight: "bold",
  },


  // AMBIENTES


  instrucao: {
    fontSize: 11,
    color: "#7D8581",
    marginTop: 3,
    marginBottom: 11,
  },


  busca: {
    height: 38,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E6E2",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 11,
    marginBottom: 8,
  },


  listaAmbientes: {
    paddingBottom: 85,
  },


  cardAmbiente: {
    backgroundColor: "#FFF",
    borderRadius: 11,
    padding: 9,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: "#E4E9E6",
  },


  linhaAmbiente: {
    flexDirection: "row",
    justifyContent: "space-between",
  },


  infoAmbiente: {
    flex: 1,
    paddingRight: 5,
  },


  nomeAmbiente: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#304039",
    lineHeight: 15,
  },


  detalheAmbiente: {
    fontSize: 9,
    color: "#6E7772",
    marginTop: 3,
  },


  equipamentos: {
    fontSize: 9,
    color: "#6E7772",
    marginTop: 5,
  },


  statusAmbiente: {
    backgroundColor: "#E6F5EA",
    borderRadius: 25,
    paddingHorizontal: 9,
    paddingVertical: 7,
    height: 36,
    maxWidth: 94,
  },


  statusAmbienteTexto: {
    color: "#328157",
    fontSize: 9,
    fontWeight: "bold",
  },


  statusOcupado: {
    backgroundColor: "#FCEDE5",
  },


  statusOcupadoTexto: {
    color: "#B35D32",
  },


  statusManutencao: {
    backgroundColor: "#FFF7D9",
  },


  statusManutencaoTexto: {
    color: "#9B7B18",
  },


  botaoReservar: {
    height: 27,
    borderWidth: 1,
    borderColor: "#BBDDC8",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
  },


  textoReservar: {
    color: "#28784D",
    fontSize: 9,
    fontWeight: "bold",
  },


  // =================================================
  // DETALHES DO AMBIENTE
  // =================================================


  detalhesContainer: {
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 30,
  },


  cabecalhoDetalhes: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },


  botaoVoltarDetalhes: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#DFE7E2",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },


  nomeDetalhes: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#26332D",
  },


  espacoCabecalho: {
    width: 30,
  },


  statusDisponivel: {
    alignSelf: "flex-start",
    backgroundColor: "#E5F4E9",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 18,
  },


  statusDisponivelTexto: {
    color: "#2D8051",
    fontSize: 9,
    fontWeight: "bold",
  },


  tituloEquipamentos: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#304039",
    marginBottom: 8,
  },


  itemEquipamento: {
    height: 35,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DFE8E3",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    marginBottom: 5,
  },


  iconeEquipamento: {
    fontSize: 14,
    color: "#547066",
    width: 22,
  },


  textoEquipamento: {
    fontSize: 11,
    color: "#53615B",
  },


  tituloSolicitar: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#304039",
    marginTop: 15,
    marginBottom: 8,
  },


  labelReserva: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#46534D",
    marginBottom: 4,
  },


  inputReserva: {
    height: 39,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DFE7E2",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 11,
    marginBottom: 9,
  },


  linhaHorario: {
    flexDirection: "row",
    gap: 8,
  },


  campoHorario: {
    flex: 1,
  },


  inputHorario: {
    height: 39,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DFE7E2",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 11,
  },


  botaoReservarAgora: {
    height: 35,
    backgroundColor: "#287C50",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },


  textoReservarAgora: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },


  // ESTRUTURA ABAIXO DA RESERVA


  tituloEstrutura: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#304039",
    marginTop: 19,
    marginBottom: 9,
  },


  infoEstrutura: {
    flexDirection: "row",
    gap: 7,
  },


  blocoInformacao: {
    flex: 1,
    backgroundColor: "#F1F6F3",
    borderRadius: 9,
    padding: 9,
    minHeight: 50,
  },


  tituloInformacao: {
    fontSize: 10,
    color: "#69756F",
    marginBottom: 2,
  },


  valorInformacao: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#304039",
  },


  outroAmbiente: {
    alignItems: "center",
    marginTop: 18,
    marginBottom: 15,
  },


  textoOutroAmbiente: {
    color: "#287C50",
    fontSize: 11,
    fontWeight: "bold",
  },


  // RESERVAS


  tituloPagina: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#304039",
    marginTop: 15,
    marginBottom: 15,
  },


  cardReservaGrande: {
    backgroundColor: "#FFF",
    borderRadius: 13,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E2E8E4",
    flexDirection: "row",
    justifyContent: "space-between",
  },


  botaoPrincipal: {
    height: 44,
    backgroundColor: "#287C50",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },


  textoBotaoPrincipal: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },


  // PERFIL


  cardPerfil: {
    backgroundColor: "#FFF",
    borderRadius: 13,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3E8E5",
  },


  avatar: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#E4F2E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },


  avatarTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#287C50",
  },


  nomePerfil: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#304039",
  },


  emailPerfil: {
    color: "#858D89",
    marginTop: 5,
  },


  // MENU INFERIOR


  menuInferior: {
    height: 62,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E7EBE9",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },


  itemMenu: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },


  iconeMenu: {
    fontSize: 17,
    color: "#A2AAA6",
    marginBottom: 2,
  },


  textoMenu: {
    fontSize: 9,
    color: "#909894",
  },


  menuAtivo: {
    color: "#2C8053",
    fontWeight: "bold",


// REGISTRAR OCORRÊNCIA


conteudoOcorrencia: {
  paddingHorizontal: 17,
  paddingTop: 12,
  paddingBottom: 90,
},


cabecalhoOcorrencia: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 24,
},


botaoVoltarOcorrencia: {
  width: 36,
  height: 36,
  borderWidth: 1,
  borderColor: "#DFE7E2",
  borderRadius: 9,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 8,
},


tituloOcorrencia: {
  flex: 1,
  fontSize: 25,
  fontWeight: "bold",
  color: "#26332D",
},


subtituloOcorrencia: {
  fontSize: 14,
  lineHeight: 21,
  color: "#718078",
  marginBottom: 20,
},


labelOcorrencia: {
  fontSize: 15,
  fontWeight: "bold",
  color: "#333",
  marginBottom: 6,
},


seletorOcorrencia: {
  height: 49,
  backgroundColor: "#FFF",
  borderWidth: 1,
  borderColor: "#DFE7E2",
  borderRadius: 10,
  justifyContent: "center",
  overflow: "hidden",
  marginBottom: 16,
},


campoDescricao: {
  height: 103,
  backgroundColor: "#FFF",
  borderWidth: 1,
  borderColor: "#DFE7E2",
  borderRadius: 10,
  padding: 12,
  fontSize: 14,
  color: "#304039",
  marginBottom: 20,
},


botaoRegistrarOcorrencia: {
  backgroundColor: "#287C50",
  height: 44,
  borderRadius: 9,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 2,
},


textoBotaoRegistrarOcorrencia: {
  color: "#FFF",
  fontWeight: "bold",
  fontSize: 14,


    },
  },
});



