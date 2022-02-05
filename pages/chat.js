import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzczODAzMywiZXhwIjoxOTU5MzE0MDMzfQ.hQNwkpfpX8gWWP578GEm1SqDaOHNhrHmYOEee0GDWXQ';
const SUPABASE_URL = 'https://brdimednsjitvbxovhwj.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(addMesagem) {
    return supabaseClient
    .from('mensagens')
    .on('INSERT', (respostaLive) => {
        addMesagem(respostaLive.new);
    })
    .subscribe();
}

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([
        // {
        //     id: 1,
        //     de: 'omariosouto',
        //     texto: ':sticker: https://c.tenor.com/TKpmh4WFEsAAAAAC/alura-gaveta-filmes.gif',
        // }
    ]);
    
    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                console.log('Dados da consulta:', data);
                setListaDeMensagens(data);
            });
            escutaMensagensEmTempoReal((novaMensagem) => {
                setListaDeMensagens((valorAtualDaLista) => {
                    return[
                        novaMensagem,
                        ...valorAtualDaLista,
                    ]
                });
            });
    }, []);

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            //id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,
        };

        supabaseClient
        .from('mensagens')
        .insert([
            mensagem
        ])
        .then(({ data }) => {
            console.log('Criando mensagem', data);
        });

        setMensagem('');
    }
        
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.neutrals[200],
                backgroundImage:"url(https://i.imgur.com/BZmfeAI.pnghttps://i.imgur.com/BZmfeAI.png)",
                backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundBlendMode: "multiply",
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} />
                    {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >

                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                console.log('Usando o componente] Salva sticker banco', sticker);
                                handleNovaMensagem(`:sticker: ${sticker}`)
                            }}
                        />
                        
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if(event.key === 'Enter'){
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />

                        <Button 
                            styleSheet={{
                                borderRadius: '10px',
                                padding: '0 3px 0 0',
                                minWidth: '50px',
                                minHeight: '46px',
                                fontSize: '20px',
                                marginBottom: '8px',
                                lineHeight: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: appConfig.theme.colors.neutrals[300],
                            }}
                            label='↵'
                            onClick={() => handleNovaMensagem(mensagem)}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text 
                    variant='heading4'
                    styleSheet={{
                        color: appConfig.theme.colors.neutrals[100],
                }}
                >
                    Vila dos Pelicanos
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:') 
                        ? (
                            <Image src={mensagem.texto.replace(':sticker:', '')} />
                        )
                        : (
                            mensagem.texto
                        )}
                    </Text>
                );
            })}
        </Box>
    )
}