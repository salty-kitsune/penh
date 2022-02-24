import 'regenerator-runtime';
import * as cheerio from 'cheerio';
import axios, { AxiosPromise } from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { Message, MESSAGE_TYPE } from './utils/message';
import {
  DecodeResult,
  DECODE_RESULT,
  serializeArrayBufferToJSON,
  Tag,
} from './utils/decode';
import { NUCLEAR_HOST } from './utils/isNuclearCode';

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'https://github.com/salty-kitsune/penh',
  });
});

chrome.runtime.onMessage.addListener((message: Message, sender, reply) => {
  switch (message.type) {
    case MESSAGE_TYPE.REQUEST:
      if (message.payload) decodeNuclearCode(message.payload).then(reply);

      return true;

    default:
  }
});

async function decodeNuclearCode(
  nuclearCode: string
): Promise<DecodeResult | undefined> {
  if (!nuclearCode) return;
  try {
    const scrapResult = await axios.get(
      `https://nhentai.net/g/${nuclearCode}`,
      {
        adapter: fetchAdapter,
      }
    );

    const $dom = cheerio.load(scrapResult.data);
    const $coverBlock = $dom('#cover');
    const $infoBlock = $dom('#info');
    const $tagsBlock = $dom('#tags');

    const coverSource = $coverBlock.find('img').data().src as string;

    const title = $infoBlock.find('h1.title');
    const subtitle = $infoBlock.find('h2.title');

    const tagElements = $tagsBlock.find('a.tag');

    const tags: Tag[] = [];
    tagElements.each((_, tagElement) => {
      const href = `${NUCLEAR_HOST}/${tagElement.attribs.href}`;
      const name = $dom(tagElement).children('span.name').text();

      tags.push({
        href,
        name,
      });
    });

    const { data: coverBuffer, headers } = await (axios(coverSource, {
      adapter: fetchAdapter,
      responseType: 'arraybuffer',
    }) as AxiosPromise<ArrayBuffer>);

    const imageDataView = serializeArrayBufferToJSON(
      coverBuffer,
      headers['content-type']
    );

    return {
      status: DECODE_RESULT.SUCCESS,
      data: {
        title: {
          after: title.children('.after').text(),
          before: title.children('.before').text(),
          pretty: title.children('.pretty').text(),
        },
        subtitle: {
          after: subtitle.children('.after').text(),
          before: subtitle.children('.before').text(),
          pretty: subtitle.children('.pretty').text(),
        },
        cover: {
          data: imageDataView,
          source: coverSource,
        },
        tags,
      },
    };
  } catch (error) {
    console.log({ error });

    if (axios.isAxiosError(error)) {
      console.log({ response: error?.response });
    }

    return { status: DECODE_RESULT.FAILED, data: null };
  }
}
