#!/usr/bin/env python3
"""Preview the branch directly; no service worker or image duplication required."""
import argparse,json,re
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote,urlsplit
ROOT=Path(__file__).resolve().parent.parent
APP=ROOT/'_app'
SOURCE=ROOT.parent/'longyuan-personal-reading'
ASSETS=json.loads(re.search(r'const IMAGES=(\{.*?\});', (ROOT/'asset-worker.js').read_text(),re.S).group(1))
class Handler(SimpleHTTPRequestHandler):
    def translate_path(self,path):
        relative=unquote(urlsplit(path).path).lstrip('/') or 'index.html'
        if '..' in Path(relative).parts:return str(APP/'__invalid__')
        candidate=APP/relative
        if candidate.is_file():return str(candidate)
        # Existing local images remain immutable shared-library compatibility entries.
        local=SOURCE/relative
        if relative in ASSETS and local.is_file():return str(local)
        return super().translate_path(path)
    def do_GET(self):
        relative=unquote(urlsplit(self.path).path).lstrip('/')
        target=Path(self.translate_path(self.path))
        if not target.is_file() and relative in ASSETS:
            self.send_response(302);self.send_header('Location',ASSETS[relative]);self.end_headers();return
        super().do_GET()
    def end_headers(self):
        self.send_header('Cache-Control','no-cache')
        super().end_headers()
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8898);parser.add_argument('--host',default='127.0.0.1');args=parser.parse_args()
    print(f'Discovery preview: http://{args.host}:{args.port}/',flush=True)
    ThreadingHTTPServer((args.host,args.port),partial(Handler,directory=str(APP))).serve_forever()
